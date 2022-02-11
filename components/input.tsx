import { Controller, useFormContext } from "react-hook-form";
import classNames from "classNames";

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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={name}
          className={classNames(
            { "border-red-500 border-2": error },
            "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          )}
          placeholder={placeholder}
          aria-describedby="email-description"
          {...rest}
        />
        {trailing && (
          <div className="text-gray-500 text-sm font-semibold absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
