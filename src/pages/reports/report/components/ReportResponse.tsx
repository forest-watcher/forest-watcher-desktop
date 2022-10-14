import Carousel from "components/carousel/Carousel";

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
        return <Carousel slides={[response]} />;
      default:
        return <p className="text-gray-700">{response}</p>;
    }
  };

  return (
    <section className="my-10">
      {/* Question */}
      <div className="bg-green-400 py-7 px-6">
        <p className="text-[24px] text-gray-700">{question}</p>
      </div>
      {/* Response */}
      <div className={`${type !== "blob" ? "bg-gray-300 py-7 px-6" : ""}`}>{_renderResponse()}</div>
    </section>
  );
};

export default ReportResponse;
