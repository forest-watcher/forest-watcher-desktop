import IconCard from "components/icon-card/IconCard";
import { Answer, Report } from "generated/forms/formsResponses";
import useGetUserId from "hooks/useGetUserId";
import moment from "moment";
import { useSelector } from "react-redux";

type ReportDetailsProps = {
  answer?: Answer;
  report?: Report;
};

const ReportDetails = ({ answer, report }: ReportDetailsProps) => {
  // @ts-expect-error
  const { createdAt, username, clickedPosition, areaOfInterestName, fullName } = answer?.data[0].attributes;
  const coordinates = `${clickedPosition[0].lat}, ${clickedPosition[0].lon}`;

  console.log(report);
  console.log(answer);

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
