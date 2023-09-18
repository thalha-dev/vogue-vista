import { toast } from "react-toastify";

export const sendPushNoitfication = (message, type) => {
  if (!type) {
    toast(message);
  } else if (type === "error") {
    toast.error(message);
  } else if (type === "info") {
    toast.info(message);
  } else if (type === "success") {
    toast.success(message);
  } else if (type === "warning") {
    toast.warning(message);
  }
};
