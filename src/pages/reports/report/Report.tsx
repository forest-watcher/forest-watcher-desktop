import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useGetReport } from "generated/forms/formsComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useParams } from "react-router-dom";
import ReportDetails from "./components/ReportDetails";
import ReportHeader from "./components/ReportHeader";
import ReportResponses from "./components/ReportResponses";
import ReportMap from "./components/ReportMap";
import { useState } from "react";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import ReportExportModal from "./components/modal/ReportExportModal";
import { TExportForm } from "components/modals/exports/ExportModal";
import { UnpackNestedValue } from "react-hook-form";
import { usePostV3ReportsTemplateIdExportSome } from "generated/exports/exportsComponents";
import { exportService } from "services/exports";
import { useGetV3GfwTemplatesTemplateIdAnswersAnswerId } from "generated/core/coreComponents";
import { AnswerResponse } from "generated/forms/formsSchemas";

const Report = () => {
  const { httpAuthHeader } = useAccessToken();
  const { reportId, answerId } = useParams<{ reportId: string; answerId: string }>();
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Queries - Get Report
  const { data: report, isLoading: reportLoading } = useGetReport({
    pathParams: { reportId },
    headers: httpAuthHeader
  });

  const { data: answers, isLoading: answersLoading } = useGetV3GfwTemplatesTemplateIdAnswersAnswerId({
    pathParams: { templateId: reportId, answerId },
    headers: httpAuthHeader
  });

  // Mutations - Export Report
  const { mutateAsync: exportReport } = usePostV3ReportsTemplateIdExportSome();

  /**
   * Handles Report Export (Export Modal Open).
   * @param data Export Form Data -  UnpackNestedValue<TExportForm>
   * @returns
   */
  const handleExport = async (data: UnpackNestedValue<TExportForm>): Promise<string | undefined> => {
    const res = await exportReport({
      body: {
        ...data,
        language: "en",
        ids: [{ reportid: answerId, templateid: reportId }]
      },
      headers: httpAuthHeader
    });
    const report = await exportService.checkReportStatus(res.data ?? "", httpAuthHeader);
    return report.data;
  };

  const responses = answers?.data?.attributes?.responses || []; // Responses are coming back as the wrong type.
  const answer = answers?.data;

  return (
    <LoadingWrapper loading={reportLoading || answersLoading}>
      <OptionalWrapper data={showExportModal}>
        <ReportExportModal onClose={() => setShowExportModal(false)} onSave={handleExport} />
      </OptionalWrapper>
      <ReportHeader setShowExportModal={setShowExportModal} />
      <ReportMap answer={answer} />
      <ReportDetails answer={answer} report={report} />
      <ReportResponses questions={report?.data?.attributes.questions ?? []} responses={responses as AnswerResponse[]} />
    </LoadingWrapper>
  );
};

export default Report;
