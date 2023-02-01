import { PostV3GfwTeamsTeamIdUsersError, usePostV3GfwTeamsTeamIdUsers } from "generated/core/coreComponents";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useEffect } from "react";
import FormModal from "components/modals/FormModal";
import { useHistory, useParams } from "react-router-dom";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "configureYup";
import { useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { UnpackNestedValue } from "react-hook-form";
import { fireGAEvent } from "helpers/analytics";
import { TeamActions, TeamLabels } from "types/analytics";

type TParams = TTeamDetailParams & {
  memberRole: "manager" | "monitor";
};

type TAddTeamMemberForm = {
  email: string;
};

const addTeamMemberSchema = yup
  .object()
  .shape({
    email: yup.string().email()
  })
  .required();

interface IProps {
  isOpen: boolean;
}

const AddTeamMemberModal: FC<IProps> = props => {
  const { isOpen } = props;
  const { teamId, memberRole } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();

  /* Mutations */
  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync: addTeamMembers } = usePostV3GfwTeamsTeamIdUsers();
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  useEffect(() => {
    // In case the URL ends in anything else: /teams/:teamId/add/:memberRole
    if (isOpen && memberRole && memberRole !== "manager" && memberRole !== "monitor") {
      history.push(`/teams/${teamId}`);
    }
  }, [history, memberRole, isOpen, teamId]);

  const onClose = () => {
    history.push(`/teams/${teamId}`);
  };

  const onSave = async (data: UnpackNestedValue<TAddTeamMemberForm>) => {
    try {
      await addTeamMembers({
        headers: httpAuthHeader,
        pathParams: {
          teamId
        },
        body: [
          {
            email: data.email,
            role: memberRole
          }
        ]
      });

      // Ensure the Team Listing and Team Details caches are invalidated, forcing a re-fetched
      await invalidateGetUserTeams(teamId);

      toastr.success(intl.formatMessage({ id: "teams.details.add.member.success" }), "");
      fireGAEvent({
        category: "Teams",
        action: TeamActions.teamManagement,
        label: TeamLabels.AddedMonitor
      });
      onClose();
    } catch (e: any) {
      const error = e as PostV3GfwTeamsTeamIdUsersError;
      toastr.error(
        intl.formatMessage({ id: "teams.details.add.member.error" }),
        typeof error.payload === "string" ? "" : error.payload.errors[0].detail
      );
      console.error(error);
    }
  };

  return (
    <FormModal<TAddTeamMemberForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      modalTitle={memberRole ? `teams.add.${memberRole}` : "common.add"}
      submitBtnName="common.add"
      inputs={[
        {
          id: "team-member-email-input",
          htmlInputProps: {
            label: intl.formatMessage({ id: "teams.field.email" }),
            placeholder: intl.formatMessage({ id: "teams.field.email.placeholder" }),
            type: "text"
          },
          registerProps: {
            name: "email",
            options: { required: true }
          },
          formatErrors: errors => errors.email
        }
      ]}
      useFormProps={{ resolver: yupResolver(addTeamMemberSchema) }}
    />
  );
};

export default AddTeamMemberModal;
