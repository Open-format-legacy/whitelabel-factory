import { MinusCircleIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button, Field, Input, Select, TextArea, Toggle } from "../components";
import { useWalletStore } from "../stores";

interface CreateReleaseFormProps {
  isLoading: boolean;
  onCreateTrack: (data: TrackData) => void;
  requiredFilesAdded: boolean;
}
export default function CreateReleaseForm({
  isLoading,
  onCreateTrack,
  requiredFilesAdded = false
}: CreateReleaseFormProps) {
  const { t } = useTranslation("common");
  const { address } = useWalletStore();
  const [showRoyalties, setShowRoyalties] = useState<boolean>(false);
  const [showStakeholders, setShowStakeholders] = useState<boolean>(false);
  const [GBPPrice, setGBPPrice] = useState<number>(0);

  const emailRequired = t("email.required");
  const emailValid = t("email.valid");
  const passwordRequired = t("password.required");
  const passwordMinLength = t("password.minLength");

  const StakeholderSchema = {
    address: yup.string().required("Address is required"),
    share: yup.number().required("Share is required").typeError("Share must be a number")
  };

  const AttributeSchema = {
    trait_type: yup.string().required("Trait type is required"),
    value: yup.string().required("value is required")
  };

  const ReleaseSchema = yup.object().shape({
    artist: yup.string().required(),
    track_name: yup.string().required(),
    track_description: yup.string().required(),
    symbol: yup.string().required(),
    salePrice: yup.number().required().typeError("Sale price is required"),
    quantity: yup.number().required().typeError("quantity price is required"),
    royalitiesPercentage: showRoyalties
      ? yup.number().required().min(0).max(100).typeError("Royalties must between 0 - 100%")
      : yup.number().nullable().typeError("Royalties must between 0 - 100%"),
    attributes: yup.array().of(yup.object().shape(AttributeSchema)),
    stakeholders: showStakeholders
      ? yup
          .array()
          .of(yup.object().shape(StakeholderSchema))
          .required("Must have fields")
          .min(1, "Minimum of 1 stakeholder")
          .test("sum", "You must allocate 100%", (rows = []) => {
            const total = rows.reduce((total, row) => {
              return total + (row.share || 0);
            }, 0);

            return total === 100;
          })
      : yup.array().nullable()
  });

  const form = useForm<TrackData>({
    resolver: yupResolver(ReleaseSchema)
    // @dev Used for testing
    // defaultValues: {
    //   artist: "Bob",
    //   track_name: "Builder",
    //   track_description: "Can you fix it?",
    //   symbol: "BOB",
    //   salePrice: 0.002,
    //   quantity: 123,
    //   royalitiesPercentage: 100
    // }
  });

  const {
    remove: removeStakeholder,
    fields: stakeholderFields,
    append: appendStakeholder
  } = useFieldArray({
    control: form.control,
    name: "stakeholders"
  });

  const {
    remove: removeAttribute,
    fields: attributeFields,
    append: appendAttribute
  } = useFieldArray({
    control: form.control,
    name: "attributes"
  });

  const {
    reset,
    formState: { errors },
    watch
  } = form;

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=gbp")
      .then((res) => res.json())
      .then((res) => setGBPPrice(res["matic-network"].gbp));

    if (address) {
      reset({
        stakeholders: [{ address, share: 100 }],
        attributes: [{ trait_type: "genre", value: "" }]
      });
    }
  }, [address]);

  const symbolValue = watch("symbol");
  const salePriceValue = watch("salePrice");

  const currencyConversion = Boolean(salePriceValue && GBPPrice)
    ? `(£${(salePriceValue * GBPPrice).toFixed(2)})`
    : "(£0.00)";

  return (
    <FormProvider {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onCreateTrack)}>
        <div className="gradient-primary flex flex-col rounded-md p-5">
          <div className="grid grid-cols-6 gap-6">
            <Field
              className="col-span-6 lg:col-span-2"
              helpText="Add the name of the artist or band."
              error={errors.artist?.message}
            >
              <Input
                name="artist"
                label="Artist Name"
                helpText="Add the name of the artist or band."
                placeholder="The Clash"
                error={errors.artist?.message}
              />
            </Field>
            <Field
              className="col-span-6 lg:col-span-2"
              helpText="Add the name of the track."
              error={errors.track_name?.message}
            >
              <Input
                name="track_name"
                label="Track Name"
                placeholder="Bankrobber"
                helpText="Add the name of the track."
                error={errors.track_name?.message}
              />
            </Field>
            <Field
              className="col-span-6 lg:col-span-2"
              helpText="e.g. TOON, MIX, SONG"
              error={errors.symbol?.message}
            >
              <Input
                name="symbol"
                label="Blockchain Track Indentifier"
                helpText="e.g. TOON, MIX, SONG"
                placeholder="BANK"
                error={errors.symbol?.message}
                maxLength={4}
              />
            </Field>
            <Field
              className="col-span-6"
              helpText="Add a description about the track. Max 255 characters."
              error={errors.track_description?.message}
            >
              <TextArea
                name="track_description"
                label="Track Description"
                placeholder="My daddy was a bank robber, but he never hurt nobody..."
                error={errors.track_description?.message}
              />
            </Field>
          </div>
        </div>
        <div className="gradient-primary my-5 rounded-md p-5">
          <h1>{t("attributes.title")}</h1>
          <p className="text-sm font-semibold">{t("attributes.description")}</p>
          <div className="my-5 grid grid-cols-6 gap-6">
            {attributeFields.map((item, index) => {
              return (
                <div key={index} className="col-span-6 grid grid-cols-6 gap-6">
                  <Field
                    className="col-span-2"
                    helpText="Select an attribute type."
                    error={errors["attributes"]?.[index]?.trait_type?.message}
                  >
                    <Select label="Attribute Type" name={`attributes.${index}.trait_type`}>
                      <option disabled selected value="">
                        Select Attribute Type
                      </option>
                      <option value="genre">Genre</option>
                      <option value="bpm">BPM</option>
                      <option value="key">Key</option>
                      <option value="drum-machine">Drum Machine</option>
                      <option value="fx">FX</option>
                      <option value="daw">DAW</option>
                      <option value="synth">Synth</option>
                    </Select>
                  </Field>
                  <div className="col-span-3">
                    <Field
                      helpText="Add value for this attribute."
                      error={errors["attributes"]?.[index]?.value?.message}
                    >
                      <Input label="Attribute Value" name={`attributes.${index}.value`} />
                    </Field>
                  </div>
                  <div className="mx-5 pt-8" onClick={() => removeAttribute(index)}>
                    <MinusCircleIcon className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
            <Field className="col-span-6">
              {errors?.attributes?.message && (
                <p className="rounded-md bg-red-500 p-2 text-xs font-semibold">
                  {errors.attributes.message}
                </p>
              )}
            </Field>
            <Field className="col-span-6">
              <Button
                onClick={() => {
                  appendAttribute({
                    address: ""
                  });
                }}
              >
                Add Attribute
              </Button>
            </Field>
          </div>
        </div>
        <div className="gradient-primary my-5 grid grid-cols-6 gap-6 rounded-md p-5">
          <Field
            className="col-span-6 lg:col-span-3"
            helpText="How many releases are available. Leave blank for unlimited."
            error={errors.quantity?.message}
          >
            <Input
              type="number"
              name="quantity"
              label="Quantity"
              error={errors.quantity?.message}
              trailing={symbolValue}
              placeholder="1000"
            />
          </Field>
          <Field
            className="col-span-6 lg:col-span-3"
            helpText="How much does each release cost in MATIC."
            error={errors.salePrice?.message}
          >
            <Input
              name="salePrice"
              type="number"
              label="Sale Price"
              error={errors.salePrice?.message}
              placeholder="0.5"
              trailing={`MATIC ${currencyConversion}`}
            />
          </Field>
          <Field className="col-span-6 lg:col-span-3">
            <Toggle enabled={showRoyalties} setEnabled={setShowRoyalties} label="Add royalties" />
          </Field>
          <Field className="col-span-6 lg:col-span-3">
            <Toggle
              enabled={showStakeholders}
              setEnabled={setShowStakeholders}
              label={t("stakeholders.toggle")}
            />
          </Field>
        </div>
        {showRoyalties && (
          <div className="gradient-primary rounded-md p-5">
            <h1>{t("royalties.title")}</h1>
            <p className="text-sm font-semibold">{t("royalties.description")}</p>
            <div className="my-5 grid grid-cols-6 gap-6">
              <Field
                className="col-span-6 lg:col-span-3"
                helpText="Choose a number between 0 - 100%"
                error={errors.royalitiesPercentage?.message}
              >
                <Input
                  type="number"
                  name="royalitiesPercentage"
                  label="Royalty Percentage"
                  trailing="%"
                  error={errors.royalitiesPercentage?.message}
                />
              </Field>
            </div>
          </div>
        )}
        {showStakeholders && (
          <div className="gradient-primary my-5 rounded-md p-5">
            <h1>{t("stakeholders.title")}</h1>
            <p className="text-sm font-semibold">{t("stakeholders.description")}</p>
            <div className="my-5 grid grid-cols-6 gap-6">
              {stakeholderFields.map((item, index) => {
                return (
                  <div key={index} className="col-span-6 grid grid-cols-6 gap-6">
                    <Field
                      className="col-span-6 lg:col-span-4"
                      helpText={t("stakeholders.helpText")}
                      error={errors["stakeholders"]?.[index]?.address?.message}
                    >
                      <Input label="Address" name={`stakeholders.${index}.address`} />
                    </Field>
                    <div className="col-span-6 flex lg:col-span-2">
                      <Field
                        helpText="Add the percentage of the shares."
                        error={errors["stakeholders"]?.[index]?.share?.message}
                      >
                        <Input type="number" label="Shares" name={`stakeholders.${index}.share`} />
                      </Field>
                      <div className="mx-5 pt-8" onClick={() => removeStakeholder(index)}>
                        <MinusCircleIcon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
              <Field className="col-span-6">
                {errors?.stakeholders?.message && (
                  <p className="rounded-md bg-red-500 p-2 text-xs font-semibold">
                    {errors.stakeholders.message}
                  </p>
                )}
              </Field>
              <Field className="col-span-6">
                <Button
                  onClick={() => {
                    appendStakeholder({
                      address: "",
                      share: undefined
                    });
                  }}
                >
                  {t("stakeholders.add")}
                </Button>
              </Field>
            </div>
          </div>
        )}
        <Field className="my-5">
          {!isLoading && (
            <Button isLoading={isLoading} disabled={!requiredFilesAdded}>
              Create Track
            </Button>
          )}
          {!requiredFilesAdded && (
            <p className="mt-2 text-sm">You're missing an audio file and track artwork.</p>
          )}
        </Field>
      </form>
    </FormProvider>
  );
}
