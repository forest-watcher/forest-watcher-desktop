import { FC, useReducer, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Input from "components/ui/Form/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
import { teamService } from "services/teams";
import AreYouSure from "components/modals/AreYouSure";

interface IProps extends RouteComponentProps {}

interface ICreateTeamForm {
  name: string;
}

const CreateTeamModal: FC<IProps> = props => {
  const { history } = props;
  const { register, handleSubmit } = useForm<ICreateTeamForm>();
  const [isClosing, setIsClosing] = useState(false);

  const close = () => {
    history.push("/teams");
  };

  const handleCloseRequest = () => {
    setIsClosing(true);
  };

  const onSubmit: SubmitHandler<ICreateTeamForm> = async data => {
    const { data: newTeam } = await teamService.createTeam(data);
    history.push(`/teams/${newTeam.id}`);
  };

  return (
    <>
      <Modal
        isOpen={!isClosing}
        onClose={handleCloseRequest}
        title="teams.create"
        actions={[
          {
            name: "teams.create.save",
            onClick: handleSubmit(onSubmit)
          },
          { name: "common.cancel", variant: "secondary", onClick: handleCloseRequest }
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            htmlInputProps={{
              label: "Team Name",
              placeholder: "Enter Team Name",
              type: "text"
            }}
            id="team-name-input"
            registered={register("name", { required: true })}
          />
        </form>
      </Modal>

      <AreYouSure isOpen={isClosing} yesCallBack={close} noCallBack={() => setIsClosing(false)} />
    </>
  );
};

export default CreateTeamModal;
