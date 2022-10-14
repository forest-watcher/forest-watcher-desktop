import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useGetAnswerForReportV3, useGetReport } from "generated/forms/formsComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useParams } from "react-router-dom";
import ReportDetails from "./components/ReportDetails";
import ReportHeader from "./components/ReportHeader";
import ReportResponses from "./components/ReportResponses";
import ReportMap from "./components/ReportMap";

const Report = () => {
  const { httpAuthHeader } = useAccessToken();
  const { reportId, answerId } = useParams<{ reportId: string; answerId: string }>();

  // Queries - Get Report
  const { data: report, isLoading: reportLoading } = useGetReport({
    pathParams: { reportId },
    headers: httpAuthHeader
  });

  // Queries - Get Answer
  const { data: answer, isLoading: answerLoading } = useGetAnswerForReportV3({
    pathParams: { reportId, id: answerId },
    headers: httpAuthHeader
  });

  return (
    <LoadingWrapper loading={reportLoading || answerLoading}>
      <ReportHeader />
      <ReportMap answer={answer} />
      <ReportDetails />
      <ReportResponses
        questions={report?.data.attributes.questions ?? []}
        // @ts-expect-error
        responses={answer?.data[0].attributes?.responses ?? []}
      />
    </LoadingWrapper>
  );
};

export default Report;
