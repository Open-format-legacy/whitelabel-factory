import classNames from "classnames";

interface FieldProps extends Partial<HTMLDivElement> {
  children: any;
  error?: string;
  helpText?: string;
}

export default function Field({
  children,
  className,
  error,
  helpText,
}: FieldProps) {
  return (
    <div className={classNames(className, `flex flex-col`)}>
      {children}

      <p
        className={classNames(
          error ? "text-red-500" : "text-gray-500",
          "mt-2 text-sm"
        )}
      >
        {error ?? helpText}
      </p>
    </div>
  );
}
