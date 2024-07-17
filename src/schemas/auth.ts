import * as Yup from "yup";

export const AuthSchema = Yup.object().shape({
  mobileNumber: Yup.number()
    .min(11, "Please use your registered mobile number")
    .required("Please input your mobile number"),
  password: Yup.string().required("Please input your password"),
});

export const SignUpSchema = Yup.object().shape({
  fullname: Yup.string().required("Please input your fullname"),
  mobileNumber: Yup.number()
    .min(11, "Please use a valid number")
    .required("Please input your mobile number"),
  password: Yup.string().required("Please set your new password"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Password doesn't match")
    .required("Please confirm your password"),
});

export const RecoverSchema = Yup.object().shape({
  mobileNumber: Yup.number()
    .min(11, "Please use a valid number")
    .required("Please input your mobile number"),
});
