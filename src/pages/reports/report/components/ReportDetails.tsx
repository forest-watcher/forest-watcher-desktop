import IconCard from "components/icon-card/IconCard";
import { Answer, Report } from "generated/forms/formsResponses";
import moment from "moment";

type ReportDetailsProps = {
  answer?: Answer["data"];
  report?: Report;
};

const ReportDetails = ({ answer, report }: ReportDetailsProps) => {
  // @ts-expect-error
  const { createdAt, clickedPosition, areaOfInterestName, fullName } = answer?.attributes;
  const coordinates = `${clickedPosition[0].lat.toFixed(4)}, ${clickedPosition[0].lon.toFixed(4)}`;

  return (
    <section className="row column py-section">
      <h1 className="font-base text-[36px] font-light text-gray-700 mb-10">
        {
          // @ts-expect-error
          report?.data.attributes.name.en
        }
      </h1>
      <section className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        <IconCard iconName={"check"} title="Completed Date" text={moment(createdAt).format("MMM DD, YYYY")} />
        <IconCard iconName={"footprint"} title="Monitor" text={fullName} />
        <IconCard iconName={"target"} title="Monitor Coordinates" text={coordinates} />
        <IconCard iconName={"area"} title="Area" text={areaOfInterestName} />
        <IconCard iconName={"flag"} textLink="/" title="Original Assignment" text="Assignment Name" />
      </section>
    </section>
  );
};

export default ReportDetails;
