import List from "components/extensive/List";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { AnswerResponse, ReportsQuestion } from "generated/forms/formsSchemas";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import ReportExportImagesModal from "./modal/ReportExportImagesModal";
import ReportResponse, { IReportResponse } from "./ReportResponse";

type ReportResponsesProps = {
  questions: ReportsQuestion[];
  responses: AnswerResponse[];
};

const ReportResponses = ({ questions, responses }: ReportResponsesProps) => {
  const [showImagesModal, setShowImagesModal] = useState<boolean>(false);

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
          response: response.value ?? null,
          type: q.type
        };
      })
      .filter(x => x) as IReportResponse[];
  }, [questions, responses]);

  const hasImages = useMemo(() => !!responses[0]?.value, [responses]);

  return (
    <>
      <OptionalWrapper data={showImagesModal}>
        <ReportExportImagesModal onClose={() => setShowImagesModal(false)} />
      </OptionalWrapper>
      <div className="bg-neutral-400">
        <section className="row column py-section">
          <div className="flex items-center justify-between">
            <h1 className="font-base text-[36px] font-light text-neutral-700">
              <FormattedMessage id="reports.detail.responses" />
            </h1>
            <OptionalWrapper data={hasImages}>
              <Button onClick={() => setShowImagesModal(true)}>
                <FormattedMessage id="reports.detail.exportImages" />
              </Button>
            </OptionalWrapper>
          </div>
          <List items={data} render={item => <ReportResponse {...item} />} />
        </section>
      </div>
    </>
  );
};

export default ReportResponses;
