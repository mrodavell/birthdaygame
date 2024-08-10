import { BaseToast, BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  win: ({ text1, text2, ...rest }: BaseToastProps) => {
    return BaseToast({
      text1: text1,
      text1Style: { fontSize: 20, textAlign: "center" },
      text2: text2,
      text2Style: {
        fontSize: 24,
        color: "black",
        textAlign: "center",
        flexWrap: "nowrap",
        marginTop: 10,
      },
      style: {
        borderBottomColor: "green",
        borderBottomWidth: 5,
        borderLeftWidth: 0,
        minHeight: 150,
        marginTop: "50%",
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
      },
    });
  },
};
