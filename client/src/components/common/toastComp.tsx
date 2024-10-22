import toast from "react-hot-toast";

export const SuccessToast = ({ message }: { message: string }) => {
  toast.success(message, {
    style: {
      border: "1px solid #00D100",
      padding: "10px",
      color: "#00D100",
      fontSize: "12px",
    },
    iconTheme: {
      primary: "#00D100",
      secondary: "#FFFAEE",
    },
  });
};

export const ErrorToast = ({ message }: { message: string }) => {
  toast.error(message, {
    style: {
      border: "1px solid #ff3333",
      padding: "10px",
      color: "#ff3333",
      fontSize: "12px",
    },
    iconTheme: {
      primary: "#FF0000",
      secondary: "#FFFAEE",
    },
  });
};
