import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { useHistory, useParams } from "react-router-dom";
import { TParams } from "../TeamDetail";
import { useIntl } from "react-intl";

type TEditTeamForm = {
  name: string;
};

interface IProps {
  isOpen: boolean;
  currentName: string;
}

const EditTeamModal: FC<IProps> = props => {
  const { isOpen, currentName } = props;
  const intl = useIntl();
  const { teamId } = useParams<TParams>();
  const history = useHistory();

  const onClose = () => {
    history.push(`/teams/${teamId}`);
  };

  const onSave = async () => {
    // ToDo: Save team
    onClose();
  };

  return (
    <FormModal<TEditTeamForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      modalTitle="teams.details.edit"
      submitBtnName="teams.edit.save"
      inputs={[
        {
          id: "team-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "teams.field.name" }),
            placeholder: intl.formatMessage({ id: "teams.field.name.placeholder" }),
            type: "text",
            defaultValue: currentName
          },
          registerProps: {
            name: "name",
            options: { required: true, minLength: 3 }
          }
        }
      ]}
    />
  );
};

export default EditTeamModal;
