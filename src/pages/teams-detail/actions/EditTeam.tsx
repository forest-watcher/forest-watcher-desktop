import { FC } from "react";
import FormModal from "components/modals/FormModal";
import { useHistory, useParams } from "react-router-dom";
import { TParams } from "../TeamDetail";
import { useIntl } from "react-intl";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import { UnpackNestedValue } from "react-hook-form";
import { useAppDispatch } from "hooks/useRedux";
import { getUserTeams } from "modules/gfwTeams";
import useGetUserId from "hooks/useGetUserId";
import * as yup from "yup";
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
  const dispatch = useAppDispatch();
  const { teamId } = useParams<TParams>();
  const history = useHistory();
  const userId = useGetUserId();

  const onClose = () => {
    history.push(`/teams/${teamId}`);
  };

  const onSave = async (data: UnpackNestedValue<TEditTeamForm>) => {
    try {
      await teamService.updateTeam(teamId, data);
      // Refetch the User Teams
      dispatch(getUserTeams(userId));
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
      useFormProps={{ resolver: yupResolver(editTeamSchema) }}
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
