import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { UnpackNestedValue } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

type TUserNameForm = {
  firstName: string;
  lastName: string;
};

const userTeamSchema = yup
  .object()
  .shape({
    firstName: yup.string(),
    lastName: yup.string().required()
  })
  .required();

interface IProps {
  isOpen: boolean;
}

const UserNameForm: FC<IProps> = props => {
  const { isOpen } = props;
  const intl = useIntl();
  const history = useHistory();

  const onClose = () => {
    history.push("/teams");
  };

  const onSave = async (data: UnpackNestedValue<TUserNameForm>) => {
    try {
      // const { data: newTeam } = await teamService.createTeam(data);
      history.push("/");
      toastr.success(intl.formatMessage({ id: "" }), "");
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "" }), "");
      console.error(e);
    }
  };

  return (
    <FormModal<TUserNameForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      dismissible={false}
      modalTitle="signUp.profile.form.title"
      submitBtnName="common.save"
      useFormProps={{ resolver: yupResolver(userTeamSchema) }}
      inputs={[
        {
          id: "user-first-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "signUp.profile.form.field.firstName" }),
            placeholder: "",
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
            placeholder: "",
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
