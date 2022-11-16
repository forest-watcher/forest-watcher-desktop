import IconCard from "components/icon-card/IconCard";
import { AnswerResponse } from "generated/core/coreResponses";
import { Report } from "generated/forms/formsResponses";
import moment from "moment";

type ReportDetailsProps = {
  answer?: AnswerResponse["data"];
  report?: Report;
};

const ReportDetails = ({ answer, report }: ReportDetailsProps) => {
  if (answer?.attributes) {
    const { createdAt, clickedPosition, areaOfInterestName, fullName } = answer.attributes;

    const coordinates = clickedPosition?.length
      ? `${clickedPosition[0].lat.toFixed(4)}, ${clickedPosition[0].lon.toFixed(4)}`
      : "";

    return (
      <section className="row column py-section">
        <h1 className="font-base text-4xl font-light text-neutral-700 mb-10">{answer?.attributes?.reportName}</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <IconCard iconName={"check"} title="Completed Date" text={moment(createdAt).format("MMM DD, YYYY")} />
          <IconCard iconName={"footprint"} title="Monitor" text={fullName || ""} />
          <IconCard iconName={"target"} title="Monitor Coordinates" text={coordinates} />
          <IconCard iconName={"area"} title="Area" text={areaOfInterestName || ""} />

          {/* // TODO: Show this back once we understand how the assignments will be attached to answer/report response.  */}
          {/* <IconCard iconName={"flag"} textLink="/" title="Original Assignment" text="Assignment Name" /> */}
        </section>
      </section>
    );
  }

  return null;
};

export default ReportDetails;
