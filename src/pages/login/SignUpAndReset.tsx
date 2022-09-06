import SocialSignIn from "pages/login/SocialSignIn";
import React, { FC, useState } from "react";
import yup from "configureYup";
import Input from "components/ui/Form/Input";
import Button from "components/ui/Button/Button";
import { FormattedMessage, useIntl } from "react-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { TSignUpBody, userService } from "services/user";
import { TErrorResponse } from "constants/api";
import { toastr } from "react-redux-toastr";
import LoginLayout from "components/layouts/Login";
import { Link, useHistory } from "react-router-dom";

type TSignUpAndResetForm = TSignUpBody;

const signUpAndResetSchema = yup
  .object()
  .shape({
    email: yup.string().email().required()
  })
  .required();

interface IProps {
  isResetPassword: boolean;
}

const resetPasswordConfig = {
  title: "resetPW.title",
  text: "resetPW.subTitle",
  inputLabel: "signIn.input.email",
  inputPlaceholder: "signIn.input.email.placeholder",
  submitBtn: "resetPW.input.submit",
  alreadyJoinedText: "signUp.link.already.joined",
  alreadyJoinedLink: "signUp.link.signIn",
  successMessage: "resetPW.success.message",
  successMessageInfo: "resetPW.success.message.extra",
  errorMessage: "resetPW.error"
};

const signUpConfig = {
  title: "signUp.title",
  text: "signUp.subTitle",
  inputLabel: "signIn.input.email",
  inputPlaceholder: "signIn.input.email.placeholder",
  submitBtn: "signUp.input.submit",
  alreadyJoinedText: "signUp.link.already.joined",
  alreadyJoinedLink: "signUp.link.signIn",
  successMessage: "signUp.success.message",
  successMessageInfo: "signUp.success.message.extra",
  errorMessage: "signUp.error"
};

const SignUpAndReset: FC<IProps> = ({ isResetPassword = false }) => {
  const config = isResetPassword ? resetPasswordConfig : signUpConfig;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<TSignUpAndResetForm>({ resolver: yupResolver(signUpAndResetSchema) });
  const intl = useIntl();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<TSignUpAndResetForm> = async data => {
    setIsLoading(true);
    try {
      if (isResetPassword) {
        await userService.resetPassword(data);
      } else {
        await userService.signUp(data);
      }
      history.push("/login");
      toastr.success(
        intl.formatMessage({ id: config.successMessage }),
        intl.formatMessage({ id: config.successMessageInfo })
      );
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: config.errorMessage }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
      console.error(e);
      reset();
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout isLoading={isLoading} title={config.title} text={config.text}>
      <form className="c-login-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="login-email"
          htmlInputProps={{
            label: intl.formatMessage({ id: config.inputLabel }),
            placeholder: intl.formatMessage({ id: config.inputPlaceholder }),
            type: "text"
          }}
          error={errors.email}
          registered={register("email")}
        />
        <Button disabled={!isDirty} className="c-login-form__submit-btn" type="submit">
          <FormattedMessage id={config.submitBtn} />
        </Button>
      </form>
      <p className="c-login-form__link c-login-form__link--larger-font">
        <FormattedMessage id={config.alreadyJoinedText} />
        <Link className="u-margin-left-tiny" to="/login">
          <FormattedMessage id={config.alreadyJoinedLink} />
        </Link>
      </p>

      {!isResetPassword && (
        <SocialSignIn className="c-login-form__social-buttons" handleClick={() => setIsLoading(true)} />
      )}
    </LoginLayout>
  );
};

export default SignUpAndReset;
