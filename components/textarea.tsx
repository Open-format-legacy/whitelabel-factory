import classNames from "classnames";
import { Controller, useFormContext } from "react-hook-form";

interface TextAreaProps {
  name: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  rows?: number;
  error?: string;
}
export function Input({
  name,
  placeholder,
  label,
  helpText,
  rows = 3,
  error,
  ...rest
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor="email" className="block text-sm font-medium text-black">
          {label}
        </label>
      )}
      <div className="mt-1">
        <textarea
          name={name}
          id={name}
          rows={rows}
          className={classNames(
            { "border-2 border-red-500": error },
            "block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
          )}
          placeholder={placeholder}
          aria-describedby="email-description"
          {...rest}
        />
      </div>
      {helpText && (
        <p className="mt-2 text-sm text-white" id="email-description">
          {helpText}
        </p>
      )}
    </div>
  );
}

interface ControllerInputProps extends TextAreaProps {
  name: string;
  defaultValue?: any;
}

export default function ControlledInput({
  name,
  defaultValue = "",
  ...rest
}: ControllerInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field }) => <Input {...field} {...rest} />}
    />
  );
}
