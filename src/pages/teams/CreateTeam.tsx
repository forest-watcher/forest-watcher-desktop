import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import Input from "components/ui/Form/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps {}

interface ICreateTeamForm {
  teamName: String;
}

const CreateTeamModal: FC<IProps> = props => {
  const { history } = props;
  const { register, handleSubmit } = useForm<ICreateTeamForm>();
  const isOpen = true;

  const close = () => {
    history.push("/teams");
  };

  const createTeam: SubmitHandler<ICreateTeamForm> = data => {
    console.log(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="teams.create"
      actions={[
        {
          name: "teams.create.save",
          onClick: handleSubmit(createTeam)
        },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <form onSubmit={handleSubmit(createTeam)}>
        <Input
          htmlInputProps={{
            label: "Team Name",
            placeholder: "Enter Team Name",
            type: "text"
          }}
          id="team-name-input"
          registered={register("teamName", { required: true })}
        />
      </form>
    </Modal>
  );
};

export default CreateTeamModal;
