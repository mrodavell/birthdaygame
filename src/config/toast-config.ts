import { BaseToast, BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  win: ({ text1, text2, ...rest }: BaseToastProps) => {
    return BaseToast({
      text1: text1,
      text1Style: { fontSize: 20, textAlign: "center" },
      text2: text2,
      text2Style: { fontSize: 14, color: "black", textAlign: "center" },
      style: {
        borderBottomColor: "green",
        borderBottomWidth: 5,
        borderLeftWidth: 0,
        minHeight: 70,
      },
    });
  },
};
