import { Switch } from "@headlessui/react";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface ToggleProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  label: string;
}

export default function Toggle({ enabled, setEnabled, label }: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? " bg-purple-500" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-white border-transparent outline-none ring-2 ring-white ring-offset-1 transition-colors duration-200 ease-in-out"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-semibold text-white">{label}</span>
      </Switch.Label>
    </Switch.Group>
  );
}
