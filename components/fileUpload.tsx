import { CloudUploadIcon } from "@heroicons/react/outline";

interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  text: string;
  name: string;
  accept: string;
}

export default function FileUpload({
  onFileUpload,
  label,
  text,
  name,
  accept,
}: FileUploadProps) {
  return (
    <div className="flex justify-between">
      <div>
        <span>{label}</span>
      </div>

      <label
        className="flex hover:text-blue-400 font-semibold"
        htmlFor={name}
      >
        <span className="whitespace-nowrap">{text}</span>
        <CloudUploadIcon className="w-6 h-6 mx-2" />
      </label>
      <input
        id={name}
        className="hidden"
        name="file-upload"
        type="file"
        onChange={onFileUpload}
        accept={accept}
      />
    </div>
  );
}
