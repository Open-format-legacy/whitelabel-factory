import { toast } from "react-hot-toast";

export function loadingNotification(message: string) {
  return toast.loading(message, {
    icon: "⛏",
    position: "bottom-center",
    className: "font-semibold tracking-tight"
  });
}

export function successNotification(message: string) {
  return toast.success(message, {
    duration: 5000,
    icon: "🚀",
    position: "bottom-center",
    className: "font-semibold tracking-tight"
  });
}

export function dismissNotification(notification: string) {
  return toast.dismiss(notification);
}

export function errorNotification(message: string) {
  return toast.error(message, {
    duration: 5000,
    icon: "😭",
    position: "bottom-center",
    className: "font-semibold tracking-tight"
  });
}
