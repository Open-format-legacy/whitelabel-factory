import { toast } from "react-hot-toast";

export function loadingNotification(message: string) {
  return toast.loading(message, {
    icon: "⛏",
    position: "bottom-center",
    className: "font-semibold",
    style: {
      background: "#333",
      color: "#fff",
      borderColor: "#2dd4bf",
      borderWidth: "1px",
      padding: "1rem",
      maxWidth: 700
    }
  });
}

export function successNotification(message: string, duration: number | string = 5000) {
  return toast.success(message, {
    duration,
    icon: "🚀",
    position: "bottom-center",
    className: "font-semibold",
    style: {
      background: "#333",
      color: "#fff",
      borderColor: "#2dd4bf",
      borderWidth: "1px",
      padding: "1rem",
      maxWidth: 700
    }
  });
}

export function dismissNotification(notification?: string) {
  return toast.dismiss(notification ?? undefined);
}

export function errorNotification(message: string) {
  return toast.error(message, {
    duration: 5000,
    icon: "😭",
    position: "bottom-center",
    className: "font-semibold",
    style: {
      background: "#333",
      color: "#fff",
      borderColor: "#2dd4bf",
      borderWidth: "1px",
      padding: "1rem",
      maxWidth: 700
    }
  });
}
