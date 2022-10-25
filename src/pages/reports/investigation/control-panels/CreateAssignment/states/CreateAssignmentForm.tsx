import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import RadioGroup from "components/ui/Form/RadioGroup/RadioGroup";
import MultiSelectDialog from "components/ui/Form/Select/MultiSelectDialog";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";

export interface IProps {}

const GROUPS = [
  {
    label: "Default",
    options: [{ value: "Me", label: "Myself (Default)" }]
  },
  {
    label: "Team 1",
    options: [
      { value: "1", label: "Paula Storm" },
      { value: "2", label: "Horacio Cruz" },
      { value: "3", label: "Tom Cortes" },
      { value: "4", label: "Emilia Cuaron" }
    ]
  },
  {
    label: "Team 2",
    options: [
      { value: "5", label: "Paula Storm" },
      { value: "6", label: "Horacio Cruz" },
      { value: "7", label: "Tom Cortes" },
      { value: "8", label: "Emilia Cuaron" }
    ]
  }
];

type TCreateAssignmentFormFields = {
  priority: number;
  monitors: string[];
  templates: string[];
};

enum EDialogsNames {
  None = "none",
  Monitors = "monitors",
  Templates = "templates"
}

const CreateAssignmentForm: FC<IProps> = props => {
  const {} = props;
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { handleSubmit, control } = useForm<TCreateAssignmentFormFields>({
    defaultValues: {
      priority: 0,
      monitors: ["Me"]
    }
  });

  const [openDialogName, setOpenDialogName] = useState<EDialogsNames>(EDialogsNames.None);

  const onSubmit = (data: any) => console.log(data);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: `assignment.create.dialog.title.${openDialogName}` })}
      onBack={() => {
        if (openDialogName === EDialogsNames.None) {
          history.push(location.pathname.replace("/assignment", ""));
        } else {
          setOpenDialogName(EDialogsNames.None);
        }
      }}
      footer={
        openDialogName === EDialogsNames.None ? (
          <Button disabled>
            <FormattedMessage id="assignment.create" />
          </Button>
        ) : null
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <OptionalWrapper data={openDialogName === EDialogsNames.None}>
          <RadioGroup<TCreateAssignmentFormFields>
            control={control}
            name="priority"
            label="assignment.create.form.priority.label"
            options={[
              { key: "normal", label: "assignment.create.form.priority.normal", value: 0 },
              { key: "high", label: "assignment.create.form.priority.high", value: 1 }
            ]}
          />

          <MultiSelectDialog.Preview
            className="mt-10"
            groups={GROUPS}
            control={control}
            name="monitors"
            label="assignment.create.form.monitor.label"
            emptyLabel="assignment.create.form.monitor.empty"
            emptyIcon="white-foot"
            addButtonLabel="assignment.create.form.monitor.add"
            onAdd={() => setOpenDialogName(EDialogsNames.Monitors)}
          />

          <MultiSelectDialog.Preview
            className="mt-10"
            groups={GROUPS}
            control={control}
            name="templates"
            label="assignment.create.form.template.label"
            emptyLabel="assignment.create.form.template.empty"
            emptyIcon="FactCheck"
            addButtonLabel="assignment.create.form.template.add"
            onAdd={() => setOpenDialogName(EDialogsNames.Templates)}
          />
        </OptionalWrapper>

        <OptionalWrapper data={openDialogName === EDialogsNames.Monitors}>
          <MultiSelectDialog groups={GROUPS} control={control} name="monitors" />
        </OptionalWrapper>

        <OptionalWrapper data={openDialogName === EDialogsNames.Templates}>
          <MultiSelectDialog groups={GROUPS} control={control} name="templates" />
        </OptionalWrapper>
      </form>
    </MapCard>
  );
};

export default CreateAssignmentForm;
