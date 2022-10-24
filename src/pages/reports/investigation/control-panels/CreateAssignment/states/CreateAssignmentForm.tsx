import RadioGroup from "components/ui/Form/RadioGroup/RadioGroup";
import { FC } from "react";
import { useForm } from "react-hook-form";

export interface IProps {}

type TCreateAssignmentFormFields = {
  priority: number;
};

const CreateAssignmentForm: FC<IProps> = props => {
  const {} = props;
  const { handleSubmit, control } = useForm<TCreateAssignmentFormFields>({
    defaultValues: {
      priority: 0
    }
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioGroup<TCreateAssignmentFormFields>
        control={control}
        name="priority"
        label="assignment.create.form.priority.label"
        options={[
          { key: "normal", label: "assignment.create.form.priority.normal", value: 0 },
          { key: "high", label: "assignment.create.form.priority.high", value: 1 }
        ]}
      />
    </form>
  );
};

export default CreateAssignmentForm;
