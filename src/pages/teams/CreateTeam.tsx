import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import Input from "components/ui/Form/Input";
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps {}

const CreateTeamModal: FC<IProps> = props => {
  const { history } = props;
  const { register } = useForm();
  const isOpen = true;

  const onClose = () => {
    history.push("/teams");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="common.create">
      <Input
        htmlInputProps={{
          label: "Team Name",
          onChange: () => {},
          placeholder: "Enter Team Name",
          type: "text"
        }}
        id="text-input"
        onChange={function noRefCheck() {}}
        registered={register("exampleInput", { required: true })}
      />
    </Modal>
  );
};

export default CreateTeamModal;
