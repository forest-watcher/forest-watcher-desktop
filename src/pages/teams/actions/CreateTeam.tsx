import useGetUserTeams from "hooks/querys/teams/useGetUserTeams";
import { FC, useMemo } from "react";
import FormModal from "components/modals/FormModal";
import { UnpackNestedValue } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import { useIntl } from "react-intl";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import useUrlQuery from "hooks/useUrlQuery";
import { fireGAEvent } from "helpers/analytics";
import { TeamActions, TeamLabels } from "types/analytics";

type TCreateTeamForm = {
  name: string;
};

const createTeamSchema = yup
  .object()
  .shape({
    name: yup.string().min(3)
  })
  .required();

interface IProps {
  isOpen: boolean;
}

const CreateTeamModal: FC<IProps> = props => {
  const { isOpen } = props;
  const intl = useIntl();
  const history = useHistory();
  const urlQuery = useUrlQuery();
  const { invalidateGetUserTeams } = useGetUserTeams();
  const backTo = useMemo(() => urlQuery.get("backTo"), [urlQuery]);

  const onClose = () => {
    history.push(backTo || "/teams");
  };

  const onSave = async (data: UnpackNestedValue<TCreateTeamForm>) => {
    try {
      // ToDo: use fw_core and invalidate teams fetch
      const { data: newTeam } = await teamService.createTeam(data);

      await invalidateGetUserTeams();

      history.push(backTo || `/teams/${newTeam.id}`);
      toastr.success(intl.formatMessage({ id: "teams.create.success" }), "");
      fireGAEvent({
        category: "Teams",
        action: TeamActions.teamCreation,
        label: TeamLabels.TeamCreationComplete
      });
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "teams.create.error" }), "");
      console.error(e);
    }
  };

  return (
    <FormModal<TCreateTeamForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      modalTitle="teams.create"
      submitBtnName="teams.create.save"
      useFormProps={{ resolver: yupResolver(createTeamSchema), defaultValues: { name: "" } }}
      inputs={[
        {
          id: "team-name-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "teams.field.name" }),
            placeholder: intl.formatMessage({ id: "teams.field.name.placeholder" }),
            type: "text"
          },
          registerProps: {
            name: "name",
            options: { required: true }
          },
          formatErrors: errors => errors.name
        }
      ]}
    />
  );
};

export default CreateTeamModal;
