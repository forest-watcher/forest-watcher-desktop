import { FC } from "react";
import CreateTeamModal from "../../teams/CreateTeam";

interface IProps {
  isOpen: boolean;
  currentName: string;
}

const EditTeamModal: FC<IProps> = props => {
  const { isOpen, currentName } = props;

  return <CreateTeamModal isOpen={isOpen} currentName={currentName} />;
};

export default EditTeamModal;
