import List from "components/extensive/List";
import Button from "components/ui/Button/Button";
import { AnswerResponse, ReportsQuestion } from "generated/forms/formsSchemas";
import { useMemo } from "react";
import ReportResponse, { IReportResponse } from "./ReportResponse";

type ReportResponsesProps = {
  questions: ReportsQuestion[];
  responses: AnswerResponse[];
};

const ReportResponses = ({ questions, responses }: ReportResponsesProps) => {
  console.log("Q: ", questions);
  console.log("R: ", responses);

  const data = useMemo(() => {
    return questions
      .map(q => {
        const response = responses.find(r => r.name === q.name);
        if (!response) return undefined;
        const formattedQuestion = q.name
          .split("-")
          .map(s => s[0].toUpperCase() + s.slice(1))
          .join(",")
          .replace(",", " ");

        return {
          // @ts-expect-error
          question: `${formattedQuestion}: ${q.label.en}`,
          response: response.value ?? "N/A",
          type: q.type
        };
      })
      .filter(x => x) as IReportResponse[];
  }, [questions, responses]);

  return (
    <div className="bg-gray-400">
      <section className="row column py-section">
        <div className="flex items-center justify-between">
          <h1 className="font-base text-[36px] font-light text-gray-700">Report Responses</h1>
          <Button>Export Images</Button>
        </div>
        <List items={data} render={item => <ReportResponse {...item} />} />
      </section>
    </div>
  );
};

export default ReportResponses;
