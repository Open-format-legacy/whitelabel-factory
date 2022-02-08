import { useForm, useFieldArray } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Button } from "../components";

interface CreateReleaseProps {
  isLoading: boolean;
  onCreateTrack: (data: TrackData) => void;
}
export default function LoginForm({
  isLoading,
  onCreateTrack,
}: CreateReleaseProps) {
  const { t } = useTranslation("auth");

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
    name: yup.string().required(),
    symbol: yup.string().required(),
    salePrice: yup.number().required(),
    quantity: yup.number().required(),
    royalitiesPercentage: yup.number().required().min(1).max(10000),
    stakeholders: yup
      .array()
      .of(yup.object().shape(StakeholderSchema))
      .required("Must have fields")
      .min(1, "Minimum of 1 field")
      .test("sum", "You must allocate 100%", (rows = []) => {
        const total = rows.reduce((total, row) => {
          return total + (row.share || 0);
        }, 0);

        console.log({ total });

        return total === 100;
      }),
  });
  const form = useForm<TrackData>({
    resolver: yupResolver(ReleaseSchema),
  });

  const { remove, fields, append } = useFieldArray({
    control: form.control,
    name: "stakeholders",
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={form.handleSubmit(onCreateTrack)}>
      <div className="flex flex-col my-5">
        <h1 className="text-2xl font-semibold">Artist information</h1>
        <label htmlFor="name">Artist</label>
        <input
          style={{ border: "1px solid black" }}
          placeholder="Track name"
          {...register("artist")}
        />
        {errors.artist && (
          <p className="text-sm py-2 text-red-500">
            {errors.artist.message}
          </p>
        )}
        <h1 className="text-2xl font-semibold">Track information</h1>
        <label htmlFor="name">Name</label>
        <input
          style={{ border: "1px solid black" }}
          placeholder="Track name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm py-2 text-red-500">
            {errors.name.message}
          </p>
        )}
        <label htmlFor="symbol">Symbol</label>
        <input
          placeholder="Symbol e.g TOON"
          style={{ border: "1px solid black" }}
          {...register("symbol")}
        />
        {errors.symbol && (
          <p className="text-sm py-2 text-red-500">
            {errors.symbol.message}
          </p>
        )}
        <label htmlFor="salePrice">Sale Price</label>
        <input
          type="number"
          style={{ border: "1px solid black" }}
          {...register("salePrice")}
        />
        {errors.salePrice && (
          <p className="text-sm py-2 text-red-500">
            {errors.salePrice.message}
          </p>
        )}
        <label htmlFor="name">Quantity</label>
        <input
          type="number"
          style={{ border: "1px solid black" }}
          {...register("quantity")}
        />
        {errors.quantity && (
          <p className="text-sm py-2 text-red-500">
            {errors.quantity.message}
          </p>
        )}
        <label htmlFor="royalitiesPercentage">
          Royalty Percentage
        </label>
        <input
          type="number"
          style={{ border: "1px solid black" }}
          {...register("royalitiesPercentage")}
        />
        {errors.royalitiesPercentage && (
          <p className="text-sm py-2 text-red-500">
            {errors.royalitiesPercentage.message}
          </p>
        )}
      </div>

      <div className="my-5">
        <h1 className="text-2xl font-semibold">Shareholders</h1>
        <ul>
          {fields.map((item, index) => {
            return (
              <li className="my-5" key={item.id}>
                <label htmlFor={`stakeholders.${index}.address`}>
                  Address
                </label>
                <input
                  style={{ border: "1px solid black" }}
                  placeholder="0x...."
                  {...register(`stakeholders.${index}.address`)}
                />
                {errors?.stakeholders?.[index]?.address && (
                  <p className="text-sm py-2 text-red-500">
                    {errors.stakeholders[index].address.message}
                  </p>
                )}

                <label htmlFor={`stakeholders.${index}.address`}>
                  Share
                </label>
                <input
                  style={{ border: "1px solid black" }}
                  placeholder="10"
                  {...register(`stakeholders.${index}.share`)}
                />
                {errors?.stakeholders?.[index]?.share && (
                  <p className="text-sm py-2 text-red-500">
                    {errors.stakeholders[index].share.message}
                  </p>
                )}

                <button type="button" onClick={() => remove(index)}>
                  Delete Shareholder
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => {
            append({
              address: "",
              share: undefined,
            });
          }}
        >
          Add Shareholder
        </button>
        {errors?.stakeholders && (
          <p className="text-sm py-2 text-red-500">
            {errors.stakeholders.message}
          </p>
        )}
      </div>
      <Button isLoading={isLoading}>Create Track</Button>
    </form>
  );
}
