import Carousel from "components/carousel/Carousel";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import HeaderCard from "components/ui/Card/HeaderCard";

export interface IReportResponse {
  question: string;
  response: string;
  type: string;
}

interface ReportResponseProps extends IReportResponse {}

const ReportResponse = ({ question, response, type }: ReportResponseProps) => {
  const _renderResponse = () => {
    switch (type) {
      case "blob":
        // @ts-ignore response in this case is an array of strings.
        return <Carousel downloadable slides={response ? response : []} />;
      default:
        return <p className="text-neutral-700">{response ?? "N/A"}</p>;
    }
  };

  return (
    <HeaderCard className="my-10" as="section">
      <HeaderCard.Header>
        <HeaderCard.HeaderText>{question}</HeaderCard.HeaderText>
      </HeaderCard.Header>
      <OptionalWrapper data={!(type === "blob" && response !== null)} elseComponent={_renderResponse()}>
        <HeaderCard.Content> {_renderResponse()}</HeaderCard.Content>
      </OptionalWrapper>
    </HeaderCard>
  );
};

export default ReportResponse;
