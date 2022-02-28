import { MinusCircleIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button, Field, Input, TextArea, Toggle } from "../components";
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

  const emailRequired = t("email.required");
  const emailValid = t("email.valid");
  const passwordRequired = t("password.required");
  const passwordMinLength = t("password.minLength");

  const StakeholderSchema = {
    address: yup.string().required(),
    share: yup.number().required()
  };

  const ReleaseSchema = yup.object().shape({
    artist: yup.string().required(),
    track_name: yup.string().required(),
    track_description: yup.string().required(),
    symbol: yup.string().required(),
    salePrice: yup.number().required().typeError("Sale price is required"),
    quantity: yup.number().required().typeError("quantity price is required"),
    royalitiesPercentage: showRoyalties
      ? yup.number().required().min(0).max(10000).typeError("Royalties must between 0 - 10000")
      : yup.number().nullable().typeError("Royalties must between 0 - 10000"),
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
  });

  const { remove, fields, append } = useFieldArray({
    control: form.control,
    name: "stakeholders"
  });

  const {
    reset,
    formState: { errors },
    watch
  } = form;

  useEffect(() => {
    if (address) {
      reset({
        stakeholders: [{ address, share: 100 }],
        royalitiesPercentage: 0
      });
    }
  }, [address]);

  const symbolValue = watch("symbol");

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
            helpText="How much does each release cost."
            error={errors.salePrice?.message}
          >
            <Input
              name="salePrice"
              label="Sale Price"
              error={errors.salePrice?.message}
              placeholder="0.5"
              trailing="MATIC"
            />
          </Field>
          <Field className="col-span-6 lg:col-span-3">
            <Toggle enabled={showRoyalties} setEnabled={setShowRoyalties} label="Add royalties" />
          </Field>
          <Field className="col-span-6 lg:col-span-3">
            <Toggle
              enabled={showStakeholders}
              setEnabled={setShowStakeholders}
              label="Add stakeholders"
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
                helpText="Choose a number between 0 - 10000. e.g 250 = 2.5%."
                error={errors.royalitiesPercentage?.message}
              >
                <Input
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
              {fields.map((item, index) => {
                return (
                  <div key={index} className="col-span-6 grid grid-cols-6 gap-6">
                    <Field
                      className="col-span-6 lg:col-span-4"
                      helpText="Add the ethereum address of the stakeholder."
                    >
                      <Input
                        label="Address"
                        name={`stakeholders.${index}.address`}
                        error={errors.stakeholders?.message}
                      />
                    </Field>
                    <div className="col-span-6 flex lg:col-span-2">
                      <Field helpText="Add the percentage of the shares.">
                        <Input
                          label="Shares"
                          name={`stakeholders.${index}.share`}
                          error={errors.stakeholders?.message}
                        />
                      </Field>
                      <div className="mx-5 pt-8" onClick={() => remove(index)}>
                        <MinusCircleIcon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
              <Field className="col-span-6">
                {errors?.stakeholders && (
                  <p className="rounded-md bg-red-500 p-2 text-xs font-semibold">
                    {errors.stakeholders.message}
                  </p>
                )}
              </Field>
              <Field className="col-span-6">
                <Button
                  onClick={() => {
                    append({
                      address: "",
                      share: undefined
                    });
                  }}
                >
                  Add stakeholder
                </Button>
              </Field>
            </div>
          </div>
        )}
        <Field className="my-5">
          {!isLoading && <Button isLoading={isLoading}>Create Track</Button>}
          {!requiredFilesAdded && (
            <p className="mt-2 text-sm">You're missing an audio file and track artwork.</p>
          )}
        </Field>
      </form>
    </FormProvider>
  );
}
