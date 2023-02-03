import { usePostV3GfwTeams } from "generated/core/coreComponents";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useMemo } from "react";
import FormModal from "components/modals/FormModal";
import { UnpackNestedValue } from "react-hook-form";
import { useHistory } from "react-router-dom";
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
  const invalidateGetUserTeams = useInvalidateGetUserTeams();
  const backTo = useMemo(() => urlQuery.get("backTo"), [urlQuery]);

  /* Mutations */
  const { httpAuthHeader } = useAccessToken();
  // Create a New Team
  const { mutateAsync: createTeam } = usePostV3GfwTeams();

  const onClose = () => {
    history.push(backTo || "/teams");
  };

  const onSave = async (data: UnpackNestedValue<TCreateTeamForm>) => {
    try {
      const { data: newTeam } = await createTeam({ headers: httpAuthHeader, body: data });

      await invalidateGetUserTeams();

      history.push(backTo || `/teams/${newTeam?.id}`);
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
