import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { AssignmentResponse } from "generated/core/coreResponses";
import useGetUserId from "hooks/useGetUserId";
import { FC } from "react";
import { useIntl } from "react-intl";
import MapCard from "components/ui/Map/components/cards/MapCard";
import moment from "moment";

export interface IProps {
  selectedAssignment?: AssignmentResponse["data"];
}

const AssignmentDetailCard: FC<IProps> = props => {
  const { selectedAssignment } = props;
  const intl = useIntl();
  const userId = useGetUserId();

  if (!selectedAssignment) return null;

  return (
    <MapCard
      className="min-w-[400px]"
      title={intl.formatMessage({ id: "assignments.details.title" }, { name: selectedAssignment?.attributes?.name })}
      titleIconName="AssignmentFlag"
      position="bottom-right"
    >
      <OptionalWrapper data={selectedAssignment?.attributes?.monitors.findIndex(monitor => monitor === userId) !== -1}>
        <div className="text-gray-700 text-base p-4 bg-gray-400 rounded-md mb-6 mt-1">
          <Icon className="align-middle mr-2" name="InfoBubble" size={20} />
          <span>{intl.formatMessage({ id: "assignments.details.assigned.to.user" })}</span>
        </div>
      </OptionalWrapper>
      <div className="text-gray-700 text-base">
        <p className="mt-1">
          {intl.formatMessage({ id: "assignments.details.createAt" })}:{" "}
          {moment(selectedAssignment?.attributes?.createdAt).format("MMM DD, YYYY")}
        </p>
        <p className="mt-1">
          {intl.formatMessage({ id: "assignment.create.form.monitor.label" })}:{" "}
          {selectedAssignment?.attributes?.monitors.join(", ")}
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
