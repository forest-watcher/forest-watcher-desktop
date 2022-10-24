import { FC } from "react";
import { useForm } from "react-hook-form";

export interface IProps {}

type TCreateAssignmentFormFields = {};

const CreateAssignmentForm: FC<IProps> = props => {
  const {} = props;
  const { handleSubmit } = useForm<TCreateAssignmentFormFields>();

  const onSubmit = (data: any) => console.log(data);

  return <form onSubmit={handleSubmit(onSubmit)}></form>;
};

export default CreateAssignmentForm;
