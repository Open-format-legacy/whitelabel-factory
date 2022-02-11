import {
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { MinusCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useWalletStore } from "../stores";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Button,
  Field,
  Input,
  TextArea,
  Toggle,
} from "../components";

interface CreateReleaseProps {
  isLoading: boolean;
  onCreateTrack: (data: TrackData) => void;
  requiredFilesAdded: boolean;
}
export default function LoginForm({
  isLoading,
  onCreateTrack,
  requiredFilesAdded = false,
}: CreateReleaseProps) {
  const { t } = useTranslation("auth");
  const { address } = useWalletStore();
  const [showRoyalties, setShowRoyalties] = useState<boolean>(false);
  const [showStakeholders, setShowStakeholders] =
    useState<boolean>(false);

  const emailRequired = t("email.required");
  const emailValid = t("email.valid");
  const passwordRequired = t("password.required");
  const passwordMinLength = t("password.minLength");

  const StakeholderSchema = {
    address: yup.string().required(),
    share: yup.number().required(),
  };

  const ReleaseSchema = yup.object().shape({
    artist: yup.string().required(),
    track_name: yup.string().required(),
    track_description: yup.string().required(),
    symbol: yup.string().required(),
    salePrice: yup.number().required(),
    quantity: yup.number().required(),
    royalitiesPercentage: showRoyalties
      ? yup.number().required().min(1).max(10000)
      : yup.number().nullable(),
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
      : yup.array().nullable(),
  });

  const form = useForm<TrackData>({
    resolver: yupResolver(ReleaseSchema),
    defaultValues: {
      artist: "ART",
      track_description: "My latest track",
      track_name: "Big",
      symbol: "TOON",
      salePrice: 1,
      quantity: 500,
    },
  });

  const { remove, fields, append } = useFieldArray({
    control: form.control,
    name: "stakeholders",
  });

  const {
    reset,
    register,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    if (address) {
      reset({
        stakeholders: [{ address, share: 100 }],
        royalitiesPercentage: 0,
      });
    }
  }, [address]);

  const symbolValue = watch("symbol");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onCreateTrack)}>
        <div className="flex flex-col bg-indigo-300 p-5 rounded-md">
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
                error={errors.track_description?.message}
              />
            </Field>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-6 my-5 bg-indigo-300 p-5 rounded-md">
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
              trailing="MATIC"
            />
          </Field>
          <Field className="col-span-6 lg:col-span-3">
            <Toggle
              enabled={showRoyalties}
              setEnabled={setShowRoyalties}
              label="Add royalties"
            />
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
          <div className="grid grid-cols-6 gap-6 my-5 bg-indigo-300 p-5 rounded-md">
            <Field
              className="col-span-6 lg:col-span-3"
              helpText="The percentage of royalties you get whenever a release is sold on the secondary market. This can be to two decimals places. e.g 25.39"
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
        )}
        {showStakeholders && (
          <div className="grid grid-cols-6 gap-6 my-5 bg-indigo-300 p-5 rounded-md">
            {fields.map((item, index) => {
              return (
                <>
                  <Field
                    className="col-span-6 lg:col-span-3"
                    helpText="Add the ethereum address of the stakeholder."
                  >
                    <Input
                      label="Address"
                      name={`stakeholders.${index}.address`}
                      error={errors.stakeholders?.message}
                    />
                  </Field>
                  <Field
                    className="col-span-6 lg:col-span-3"
                    helpText="Add the percentage of the shares."
                  >
                    <Input
                      label="Shares"
                      name={`stakeholders.${index}.share`}
                      error={errors.stakeholders?.message}
                    />
                    <div
                      className="mx-5"
                      onClick={() => remove(index)}
                    >
                      <MinusCircleIcon className="h-6 w-6" />
                    </div>
                  </Field>
                </>
              );
            })}
            <Field className="col-span-6">
              {errors?.stakeholders && (
                <p className="text-sm text-red-500">
                  {errors.stakeholders.message}
                </p>
              )}
            </Field>
            <Field className="col-span-6">
              <Button
                onClick={() => {
                  append({
                    address: "",
                    share: undefined,
                  });
                }}
              >
                Add stakeholder
              </Button>
            </Field>
          </div>
        )}
        <Field className="my-5">
          <Button
            isLoading={isLoading}
            disabled={!requiredFilesAdded}
          >
            Create Track
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            You're missing an audio file and track artwork.
          </p>
        </Field>
      </form>
    </FormProvider>
  );
}
