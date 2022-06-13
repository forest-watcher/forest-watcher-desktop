import { FC, useState } from "react";
import * as yup from "yup";
import Input from "components/ui/Form/Input";
import Button from "components/ui/Button/Button";
import { FormattedMessage, useIntl } from "react-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { TSignUpBody, userService } from "services/user";
import { TErrorResponse } from "../../constants/api";
import { toastr } from "react-redux-toastr";
import LoginLayout from "components/layouts/Login";
import { Link } from "react-router-dom";

type TLoginForm = TSignUpBody;

const signUpSchema = yup
  .object()
  .shape({
    email: yup.string().email().required()
  })
  .required();

interface IProps {}

const SignUp: FC<IProps> = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<TLoginForm>({ resolver: yupResolver(signUpSchema) });
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<TLoginForm> = async data => {
    setIsLoading(true);
    try {
      await userService.signUp(data);
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(intl.formatMessage({ id: "signUp.error" }), error?.errors?.length ? error.errors[0].detail : "");
      console.error(e);
      reset();
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout isLoading={isLoading} title="signUp.title" text="signUp.subTitle">
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
        <Button disabled={!isDirty} className="c-login-form__submit-btn" type="submit">
          <FormattedMessage id="signUp.input.submit" />
        </Button>
      </form>
      <p className="c-login-form__link c-login-form__link--larger-font">
        <FormattedMessage id="signUp.link.already.joined" />
        <Link className="u-margin-left-tiny" to="/login">
          <FormattedMessage id="signUp.link.signIn" />
        </Link>
      </p>
    </LoginLayout>
  );
};

export default SignUp;
