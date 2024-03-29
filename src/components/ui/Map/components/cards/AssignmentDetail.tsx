import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { AssignmentResponse } from "generated/core/coreResponses";
import useGetUserId from "hooks/useGetUserId";
import { FC, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MapCard from "components/ui/Map/components/cards/MapCard";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import useGetUserTeamsWithActiveMembers from "hooks/querys/teams/useGetUserTeamsWithActiveMembers";
import { TeamMemberModel } from "generated/core/coreSchemas";
import ReactDOM from "react-dom";
import { useAppSelector } from "hooks/useRedux";

export interface IProps {
  selectedAssignment?: AssignmentResponse["data"];
  onClose: () => void;
}

type GroupedTeams = {
  [x: string | number]: TeamMemberModel[];
};

const AssignmentDetailCard: FC<IProps> = props => {
  const { selectedAssignment, onClose } = props;
  const portal = useAppSelector(state => state.layers.portal);
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

  const content = (
    <MapCard
      title={selectedAssignment?.attributes?.name || ""}
      titleIconName="AssignmentFlag"
      position="bottom-right"
      onOutsideClick={onClose}
      footer={
        <>
          {selectedAssignment?.attributes?.createdBy === userId && (
            <Link
              className="c-button c-button--secondary"
              to={`/assignment/${selectedAssignment.id}/edit?prev=${pathname}`}
            >
              {intl.formatMessage({ id: "assignments.details.edit.btn" })}
            </Link>
          )}
          <Link className="c-button c-button--primary" to={`/assignment/${selectedAssignment.id}?prev=${pathname}`}>
            {intl.formatMessage({ id: "assignments.details.view.btn" })}
          </Link>
        </>
      }
    >
      <OptionalWrapper data={isAssignedToCurrentUser}>
        <div className="text-neutral-700 text-base p-4 bg-neutral-400 rounded-md mb-6 mt-1">
          <Icon className="align-middle mr-2" name="InfoBubble" size={20} />
          <span>{intl.formatMessage({ id: "assignments.details.assigned.to.user" })}</span>
        </div>
      </OptionalWrapper>
      <ul className="c-card__text c-card__list">
        <li>
          <FormattedMessage id="assignments.details.type" />
        </li>
        <li>
          {intl.formatMessage({ id: "assignments.details.createAt" })}:{" "}
          {moment(selectedAssignment?.attributes?.createdAt).format("MMM DD, YYYY")}
        </li>
        <li>
          {intl.formatMessage({ id: "assignment.create.form.monitor.label" })}: {monitors.join(", ")}
        </li>
        <li>
          {intl.formatMessage({ id: "assignment.create.form.priority.label" })}:{" "}
          {selectedAssignment?.attributes?.priority === 1
            ? intl.formatMessage({ id: "assignment.create.form.priority.high" })
            : intl.formatMessage({ id: "assignment.create.form.priority.normal" })}
        </li>
      </ul>
    </MapCard>
  );

  return portal ? ReactDOM.createPortal(content, portal) : content;
};

export default AssignmentDetailCard;
