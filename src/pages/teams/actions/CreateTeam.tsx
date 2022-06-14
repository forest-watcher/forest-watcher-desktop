import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { UnpackNestedValue } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

type TCreateTeamForm = {
  name: string;
};

const createTeamSchema = yup
  .object()
  .shape({
    name: yup.string().min(3)
  })
  .required();

interface IProps {
  isOpen: boolean;
}

const CreateTeamModal: FC<IProps> = props => {
  const { isOpen } = props;
  const intl = useIntl();
  const history = useHistory();

  const onClose = () => {
    history.push("/teams");
  };

  const onSave = async (data: UnpackNestedValue<TCreateTeamForm>) => {
    try {
      const { data: newTeam } = await teamService.createTeam(data);
      history.push(`/teams/${newTeam.id}`);
      toastr.success(intl.formatMessage({ id: "teams.create.success" }), "");
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "teams.create.error" }), "");
      console.error(e);
    }
  };

  return (
    <FormModal<TCreateTeamForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      modalTitle="teams.create"
      submitBtnName="teams.create.save"
      useFormProps={{ resolver: yupResolver(createTeamSchema) }}
      inputs={[
        {
          id: "team-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "teams.field.name" }),
            placeholder: intl.formatMessage({ id: "teams.field.name.placeholder" }),
            type: "text"
          },
          registerProps: {
            name: "name",
            options: { required: true }
          },
          formatErrors: errors => errors.name
        }
      ]}
    />
  );
};

export default CreateTeamModal;
