import List from "components/extensive/List";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { AnswerResponse, ReportsQuestion } from "generated/forms/formsSchemas";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import ReportExportImagesModal from "./modal/ReportExportImagesModal";
import ReportResponse, { ReportResponseProps } from "./ReportResponse";

type ReportResponsesProps = {
  questions: ReportsQuestion[];
  responses: AnswerResponse[];
};

const ReportResponses = ({ questions, responses }: ReportResponsesProps) => {
  const [showImagesModal, setShowImagesModal] = useState<boolean>(false);

  const data = useMemo(() => {
    return questions?.reduce<ReportResponseProps[]>((combinedResponses, currentQuestionDetails) => {
      const copyCombinedResponses = [...combinedResponses];

      const response = responses.find(r => r.name === currentQuestionDetails.name);
      if (!response) return copyCombinedResponses;

      console.log(currentQuestionDetails);

      const generateCombineResponse = (name: string, label: string, type: string, value?: string) => {
        const formattedQuestion = name
          .split("-")
          .map(s => s[0].toUpperCase() + s.slice(1))
          .join(" ");

        return {
          question: `${formattedQuestion}: ${label}`,
          response: value ?? null,
          type,
          childQuestions: [] as AnswerResponse[]
        };
      };

      const combineResponse = generateCombineResponse(
        currentQuestionDetails.name,
        // @ts-ignore use browser's lang here, not "en"
        currentQuestionDetails.label.en,
        currentQuestionDetails.type,
        response.value
      );

      // When the question type is "audio"
      // Each child question contains the audio file information
      // Add this to the combineResponse object for later
      // @see src/pages/reports/report/components/ReportResponse.tsx
      if (currentQuestionDetails.type === "audio") {
        combineResponse.childQuestions = responses.filter(response =>
          currentQuestionDetails.childQuestions?.find(question => question.name === response.name)
        );
      }

      copyCombinedResponses.push(combineResponse);

      // When the question type isn't "audio"
      // Each child question is considered a separate response
      // Generate a Combined Response for each child
      if (currentQuestionDetails.type !== "audio" && currentQuestionDetails.childQuestions?.length) {
        for (let i = 0; i < currentQuestionDetails.childQuestions.length; i++) {
          const childQuestionDetails = currentQuestionDetails.childQuestions[i];
          const childQuestionResponse = responses.find(r => r.name === childQuestionDetails.name);

          copyCombinedResponses.push(
            generateCombineResponse(
              childQuestionDetails.name,
              // @ts-ignore use browser's lang here, not "en"
              childQuestionDetails.label.en,
              childQuestionDetails.type,
              childQuestionResponse?.value
            )
          );
        }
      }

      return copyCombinedResponses;
    }, []);
  }, [questions, responses]);

  const hasImages = useMemo(() => {
    const found = data.find(item => item.type === "blob");
    return !!found;
  }, [data]);

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
