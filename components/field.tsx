import classNames from "classnames";

interface FieldProps extends Partial<HTMLDivElement> {
  children: any;
  error?: string;
  helpText?: string;
}

export default function Field({ children, className, error, helpText }: FieldProps) {
  return (
    <div className={classNames(className, `flex flex-col`)}>
      {children}

      <p
        className={classNames(
          error ? "bg-red-500  text-white shadow" : "text-black-500 ",
          "mt-2 rounded-md p-2 text-xs font-semibold"
        )}
      >
        {error ?? helpText}
      </p>
    </div>
  );
}
