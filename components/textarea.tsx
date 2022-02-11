import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";

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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <textarea
          name={name}
          id={name}
          rows={rows}
          className={classNames(
            { "border-red-500 border-2": error },
            "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          )}
          placeholder={placeholder}
          aria-describedby="email-description"
          {...rest}
        />
      </div>
      {helpText && (
        <p
          className="mt-2 text-sm text-gray-500"
          id="email-description"
        >
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
