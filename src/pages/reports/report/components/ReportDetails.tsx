import OptionalWrapper from "components/extensive/OptionalWrapper";
import IconCard from "components/icon-card/IconCard";
import { useGetV3GfwAssignmentsAssignmentId } from "generated/core/coreComponents";
import { AnswerResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import { useIntl } from "react-intl";

type ReportDetailsProps = {
  answer?: AnswerResponse["data"];
};

const ReportDetails = ({ answer }: ReportDetailsProps) => {
  const intl = useIntl();
  const { httpAuthHeader } = useAccessToken();
  const { data: assignmentDetails, isLoading: isLoadingAssignment } = useGetV3GfwAssignmentsAssignmentId(
    {
      pathParams: { assignmentId: answer?.attributes?.assignmentId || "" },
      headers: httpAuthHeader
    },
    { enabled: !!answer?.attributes?.assignmentId }
  );

  if (!answer?.attributes) return null;

  const { createdAt, clickedPosition, areaOfInterestName, fullName } = answer.attributes;

  const coordinates = clickedPosition?.length
    ? `${clickedPosition[0].lat.toFixed(4)}, ${clickedPosition[0].lon.toFixed(4)}`
    : "";

  return (
    <section className="row column py-section">
      <h1 className="font-base text-4xl font-light text-neutral-700 mb-10">{answer?.attributes?.reportName}</h1>
      <section className="grid grid-cols-1 600:grid-cols-2 800:grid-cols-3 gap-7 auto-rows-min">
        <IconCard
          iconName={"check"}
          title={intl.formatMessage({ id: "common.completedDate" })}
          text={intl.formatDate(createdAt, {
            month: "short",
            day: "2-digit",
            year: "numeric"
          })}
        />
        <IconCard
          iconName={"footprint"}
          title={intl.formatMessage({ id: "reports.reports.table.header.monitor" })}
          text={fullName || ""}
        />
        <IconCard
          iconName={"target"}
          title={intl.formatMessage({ id: "reports.reports.table.header.monitorCoordinates" })}
          text={coordinates}
        />
        <IconCard
          iconName={"area"}
          title={intl.formatMessage({ id: "reports.reports.table.header.area" })}
          text={areaOfInterestName || ""}
        />
        <OptionalWrapper data={!!assignmentDetails && !isLoadingAssignment}>
          <IconCard
            iconName={"flag"}
            textLink={`/assignment/${assignmentDetails?.data?.id}`}
            title={intl.formatMessage({ id: "reports.reports.table.header.assignment" })}
            text={assignmentDetails?.data?.attributes?.name || ""}
          />
        </OptionalWrapper>
      </section>
    </section>
  );
};

export default ReportDetails;
