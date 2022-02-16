import { CloudUploadIcon } from "@heroicons/react/outline";

interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  text: string;
  name: string;
  accept: string;
}

export default function FileUpload({ onFileUpload, label, text, name, accept }: FileUploadProps) {
  return (
    <div className="flex justify-between">
      <div>
        <span>{label}</span>
      </div>

      <label className="flex font-semibold hover:text-blue-400" htmlFor={name}>
        <span className="whitespace-nowrap">{text}</span>
        <CloudUploadIcon className="mx-2 h-6 w-6" />
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
