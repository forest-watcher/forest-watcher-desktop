import React, { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TLoginBody } from "services/user";
import Input from "components/ui/Form/Input";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/ui/Button/Button";
import { useAppDispatch } from "hooks/useRedux";
import { loginUser } from "modules/user";
import { userService } from "services/user";
import { toastr } from "react-redux-toastr";
import { TErrorResponse } from "constants/api";
import LoginLayout from "components/layouts/Login";
import SocialSignIn from "pages/login/SocialSignIn";

type TLoginForm = TLoginBody;

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
  .required();

interface IProps {}

const Login: FC<IProps> = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<TLoginForm>({ resolver: yupResolver(loginSchema) });
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<TLoginForm> = async data => {
    setIsLoading(true);
    try {
      const {
        data: { token }
      } = await userService.login(data);
      dispatch(loginUser(token));
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(intl.formatMessage({ id: "signIn.error" }), error?.errors?.length ? error.errors[0].detail : "");
      console.error(e);
      reset();
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout isLoading={isLoading} title="signIn.title" text="signIn.subTitle">
      <form className="c-login-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="login-email"
          htmlInputProps={{
            label: intl.formatMessage({ id: "signIn.input.email" }),
            placeholder: intl.formatMessage({ id: "signIn.input.email.placeholder" }),
            type: "text"
          }}
          error={errors.email}
          registered={register("email")}
        />
        <Input
          id="login-password"
          htmlInputProps={{
            label: intl.formatMessage({ id: "signIn.input.password" }),
            placeholder: intl.formatMessage({ id: "signIn.input.password.placeholder" }),
            type: "password"
          }}
          error={errors.password}
          registered={register("password")}
        />
        <Button disabled={!isDirty} className="c-login-form__submit-btn" type="submit">
          <FormattedMessage id="signIn.input.submit" />
        </Button>
      </form>
      <p className="c-login-form__link">
        <Link to="/forgotten-password">
          <FormattedMessage id="signIn.link.forgotten.password" />
        </Link>
      </p>
      <p className="c-login-form__link c-login-form__link--larger-font">
        <FormattedMessage id="signIn.not.a.member" />
        <Link className="u-margin-left-tiny" to="/sign-up">
          <FormattedMessage id="signIn.link.signUp" />
        </Link>
      </p>

      <SocialSignIn className="c-login-form__social-buttons" handleClick={() => setIsLoading(true)} />
    </LoginLayout>
  );
};

export default Login;
