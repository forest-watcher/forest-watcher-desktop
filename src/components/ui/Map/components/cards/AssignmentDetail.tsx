import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { AssignmentResponse } from "generated/core/coreResponses";
import useGetUserId from "hooks/useGetUserId";
import { FC, useMemo } from "react";
import { useIntl } from "react-intl";
import MapCard from "components/ui/Map/components/cards/MapCard";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import useGetUserTeamsWithActiveMembers from "hooks/querys/teams/useGetUserTeamsWithActiveMembers";
import { TeamMemberModel } from "generated/core/coreSchemas";

export interface IProps {
  selectedAssignment?: AssignmentResponse["data"];
}

type GroupedTeams = {
  [x: string | number]: TeamMemberModel[];
};

const AssignmentDetailCard: FC<IProps> = props => {
  const { selectedAssignment } = props;
  const intl = useIntl();
  const userId = useGetUserId();
  const { pathname } = useLocation();
  const { data: teamData, isLoading: isTeamDataLoading } = useGetUserTeamsWithActiveMembers();
  const isAssignedToCurrentUser = useMemo(() => {
    return selectedAssignment?.attributes?.monitors.findIndex(monitor => monitor === userId) !== -1;
  }, [selectedAssignment?.attributes?.monitors, userId]);

  const monitors = useMemo(() => {
    if (isTeamDataLoading) {
      return [];
    }

    const groupedTeams: GroupedTeams = {};
    const assignmentMonitors = selectedAssignment?.attributes?.monitors || [];

    teamData?.forEach(team => {
      const monitors = team.attributes?.members;

      monitors?.forEach(monitor => {
        const found = assignmentMonitors.find(assignmentMonitor => monitor.userId === assignmentMonitor);
        if (found && team.id) {
          groupedTeams[team.id] = groupedTeams[team.id] ? [...groupedTeams[team.id], monitor] : [monitor];
        }
      });
    });

    const monitors = Object.entries(groupedTeams)
      .map(([teamId, members]) => {
        const team = teamData?.find(team => team.id === teamId);
        if (!team) {
          return "";
        }

        if (members.length === team.attributes?.members?.length) {
          return team.attributes.name;
        }

        return members.map(member => `${member.name} (${team.attributes?.name})`);
      })
      .flat();

    if (isAssignedToCurrentUser) {
      return [intl.formatMessage({ id: "common.yourself" }), ...monitors];
    }

    return monitors;
  }, [intl, isAssignedToCurrentUser, isTeamDataLoading, selectedAssignment?.attributes?.monitors, teamData]);

  if (!selectedAssignment) return null;

  return (
    <MapCard
      className="min-w-[400px]"
      title={intl.formatMessage({ id: "assignments.details.title" }, { name: selectedAssignment?.attributes?.name })}
      titleIconName="AssignmentFlag"
      position="bottom-right"
      footer={
        <>
          {selectedAssignment?.attributes?.createdBy === userId && (
            <Link className="c-button c-button--secondary" to={pathname}>
              {intl.formatMessage({ id: "assignments.details.edit.btn" })}
            </Link>
          )}
          <Link className="c-button c-button--primary" to={`/assignment/${selectedAssignment.id}`}>
            {intl.formatMessage({ id: "assignments.details.view.btn" })}
          </Link>
        </>
      }
    >
      <OptionalWrapper data={isAssignedToCurrentUser}>
        <div className="text-gray-700 text-base p-4 bg-gray-400 rounded-md mb-6 mt-1">
          <Icon className="align-middle mr-2" name="InfoBubble" size={20} />
          <span>{intl.formatMessage({ id: "assignments.details.assigned.to.user" })}</span>
        </div>
      </OptionalWrapper>
      <div className="text-neutral-700 text-base">
        <p className="mt-1">
          {intl.formatMessage({ id: "assignments.details.createAt" })}:{" "}
          {moment(selectedAssignment?.attributes?.createdAt).format("MMM DD, YYYY")}
        </p>
        <p className="mt-1">
          {intl.formatMessage({ id: "assignment.create.form.monitor.label" })}: {monitors.join(", ")}
        </p>
        <p className="mt-1">
          {intl.formatMessage({ id: "assignment.create.form.priority.label" })}:{" "}
          {selectedAssignment?.attributes?.priority === 1
            ? intl.formatMessage({ id: "assignment.create.form.priority.high" })
            : intl.formatMessage({ id: "assignment.create.form.priority.normal" })}
        </p>
      </div>
    </MapCard>
  );
};

export default AssignmentDetailCard;
