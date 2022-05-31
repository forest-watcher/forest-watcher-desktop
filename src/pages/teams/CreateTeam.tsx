import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import Input from "components/ui/Form/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
import { teamService } from "services/teams";

interface IProps extends RouteComponentProps {}

interface ICreateTeamForm {
  name: string;
}

const CreateTeamModal: FC<IProps> = props => {
  const { history } = props;
  const { register, handleSubmit } = useForm<ICreateTeamForm>();
  const isOpen = true;

  const close = () => {
    history.push("/teams");
  };

  const onSubmit: SubmitHandler<ICreateTeamForm> = async data => {
    const { data: newTeam } = await teamService.createTeam(data);
    history.push(`/teams/${newTeam.id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="teams.create"
      actions={[
        {
          name: "teams.create.save",
          onClick: handleSubmit(onSubmit)
        },
        { name: "common.cancel", variant: "secondary", onClick: close }
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
  );
};

export default CreateTeamModal;
