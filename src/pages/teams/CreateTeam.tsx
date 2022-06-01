import { FC, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Input from "components/ui/Form/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { teamService } from "services/teams";
import UnsavedChanges from "components/modals/UnsavedChanges";
import Loader from "../../components/ui/Loader";
import { toastr } from "react-redux-toastr";
import { useIntl } from "react-intl";

interface IProps {
  isOpen: boolean;
}

interface ICreateTeamForm {
  name: string;
}

const CreateTeamModal: FC<IProps> = props => {
  const { isOpen = false } = props;
  const intl = useIntl();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<ICreateTeamForm>();
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClosing(false);
    setIsLoading(false);
    reset();
  }, [isOpen, reset]);

  const close = () => {
    history.push("/teams");
  };

  const handleCloseRequest = () => {
    if (isDirty) {
      setIsClosing(true);
    } else {
      close();
    }
  };

  const onSubmit: SubmitHandler<ICreateTeamForm> = async data => {
    setIsLoading(true);
    try {
      const { data: newTeam } = await teamService.createTeam(data);
      history.push(`/teams/${newTeam.id}`);
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "teams.create.error" }), "");
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isClosing}
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
        <Loader isLoading={isLoading} />
        <form className="c-modal-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            error={
              errors?.name?.type === "minLength" && {
                message: intl.formatMessage({ id: "teams.create.error.name.minLength" })
              }
            }
            htmlInputProps={{
              label: "Team Name",
              placeholder: "Enter Team Name",
              type: "text"
            }}
            id="team-name-input"
            registered={register("name", { required: true, minLength: 3 })}
          />
        </form>
      </Modal>

      <UnsavedChanges isOpen={isOpen && isClosing} leaveCallBack={close} stayCallBack={() => setIsClosing(false)} />
    </>
  );
};

export default CreateTeamModal;
