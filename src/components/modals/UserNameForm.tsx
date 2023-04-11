import { useAppDispatch } from "hooks/useRedux";
import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { UnpackNestedValue } from "react-hook-form";
import { userService } from "services/user";
import { getUser } from "modules/user";
import { toastr } from "react-redux-toastr";
import { useIntl } from "react-intl";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useSelector } from "react-redux";
import { RootState } from "store";

type TUserNameForm = {
  firstName: string;
  lastName: string;
};

const userTeamSchema = yup
  .object()
  .shape({
    firstName: yup.string().required(),
    lastName: yup.string().required()
  })
  .required();

interface IProps {
  isOpen: boolean;
}

const UserNameForm: FC<IProps> = props => {
  const { isOpen } = props;
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const onSave = async (data: UnpackNestedValue<TUserNameForm>) => {
    if (user?.data) {
      try {
        await userService.setUserProfile(data, user.data.id);
        await dispatch(getUser());
        toastr.success(intl.formatMessage({ id: "signUp.profile.form.success" }), "");
      } catch (e) {
        toastr.error(intl.formatMessage({ id: "signUp.profile.form.error" }), "");
        console.error(e);
      }
    }
  };

  return (
    <FormModal<TUserNameForm>
      isOpen={isOpen}
      onSave={onSave}
      modalTitle="signUp.profile.form.title"
      submitBtnName="common.save"
      useFormProps={{ resolver: yupResolver(userTeamSchema) }}
      inputs={[
        {
          id: "user-first-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "signUp.profile.form.field.firstName" }),
            placeholder: intl.formatMessage({ id: "signUp.profile.form.field.firstNamePlaceholder" }),
            type: "text"
          },
          registerProps: {
            name: "firstName"
          },
          formatErrors: errors => errors.firstName
        },
        {
          id: "user-last-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "signUp.profile.form.field.lastName" }),
            placeholder: intl.formatMessage({ id: "signUp.profile.form.field.lastNamePlaceholder" }),
            type: "text"
          },
          registerProps: {
            name: "lastName"
          },
          formatErrors: errors => errors.lastName
        }
      ]}
    />
  );
};

export default UserNameForm;
