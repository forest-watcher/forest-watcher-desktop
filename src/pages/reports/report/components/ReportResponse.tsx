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
        return <Carousel downloadable slides={response ? [response] : []} />;
      default:
        return <p className="text-neutral-700">{response ?? "N/A"}</p>;
    }
  };

  return (
    <section className="my-10">
      {/* Question */}
      <div className="bg-primary-400 border-2 border-solid border-primary-500 py-7 px-6 rounded-t-[4px] border-opacity-20">
        <p className="text-[24px] text-neutral-700">{question}</p>
      </div>
      {/* Response */}
      <div
        className={`${
          type === "blob" && response !== null
            ? ""
            : "bg-neutral-300 py-7 px-6 border-2 border-solid border-neutral-500 border-opacity-40 rounded-b-[4px]"
        }`}
      >
        {_renderResponse()}
      </div>
    </section>
  );
};

export default ReportResponse;
