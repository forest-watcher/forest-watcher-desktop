import { useGetV3GfwTemplatesAllAnswers } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";

const useGetAllReportAnswersForUser = () => {
  /*
   * Queries - Fetch all Report Answers
   */
  const { httpAuthHeader } = useAccessToken();
  const { data, ...rest } = useGetV3GfwTemplatesAllAnswers(
    { headers: httpAuthHeader },
    {
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  );

  // Remove nested data property
  return { data: data?.data, ...rest };
};

export default useGetAllReportAnswersForUser;
