import classNames from "classNames";
import { Controller, useFormContext } from "react-hook-form";

interface InputProps extends Partial<HTMLInputElement> {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  trailing?: any;
  error?: string;
}
export function Input({
  name,
  type = "text",
  placeholder,
  label,
  helpText,
  trailing,
  error,
  ...rest
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor="email" className="block text-sm font-medium text-black">
          {label}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={name}
          className={classNames(
            { "border-2 border-red-500": error },
            "block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
          )}
          placeholder={placeholder}
          aria-describedby="email-description"
          {...rest}
        />
        {trailing && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-semibold text-black">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

interface ControllerInputProps extends InputProps {
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
