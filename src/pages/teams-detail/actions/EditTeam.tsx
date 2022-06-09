import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { useHistory, useParams } from "react-router-dom";
import { TParams } from "../TeamDetail";

type TEditTeamForm = {
  name: string;
};

interface IProps {
  isOpen: boolean;
  currentName: string;
}

const EditTeamModal: FC<IProps> = props => {
  const { isOpen, currentName } = props;
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
            label: "Team Name",
            placeholder: "Enter Team Name",
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
