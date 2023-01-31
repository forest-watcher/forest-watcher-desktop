import { usePatchV3GfwTeamsTeamId } from "generated/core/coreComponents";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { useHistory, useParams } from "react-router-dom";
import { TParams } from "../TeamDetail";
import { useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { UnpackNestedValue } from "react-hook-form";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

type TEditTeamForm = {
  name: string;
};

const editTeamSchema = yup
  .object()
  .shape({
    name: yup.string().min(3)
  })
  .required();

interface IProps {
  isOpen: boolean;
  currentName: string;
}

const EditTeamModal: FC<IProps> = props => {
  const { isOpen, currentName } = props;
  const intl = useIntl();
  const { teamId } = useParams<TParams>();
  const history = useHistory();
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  /* Mutations */
  // Update a Team Name
  const { mutateAsync: updateTeamName } = usePatchV3GfwTeamsTeamId();

  const onClose = () => {
    history.push(`/teams/${teamId}`);
  };

  const onSave = async (data: UnpackNestedValue<TEditTeamForm>) => {
    try {
      await updateTeamName({ pathParams: { teamId }, body: data });

      await invalidateGetUserTeams();

      toastr.success(intl.formatMessage({ id: "teams.edit.success" }), "");
      onClose();
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "teams.edit.error" }), "");
      console.error(e);
    }
  };

  return (
    <FormModal<TEditTeamForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      modalTitle="teams.details.edit"
      submitBtnName="teams.edit.save"
      useFormProps={{ resolver: yupResolver(editTeamSchema), defaultValues: { name: currentName } }}
      inputs={[
        {
          id: "team-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "teams.field.name" }),
            placeholder: intl.formatMessage({ id: "teams.field.name.placeholder" }),
            type: "text",
            defaultValue: currentName
          },
          registerProps: {
            name: "name",
            options: { required: true, minLength: 3 }
          },
          formatErrors: errors => errors.name
        }
      ]}
    />
  );
};

export default EditTeamModal;
