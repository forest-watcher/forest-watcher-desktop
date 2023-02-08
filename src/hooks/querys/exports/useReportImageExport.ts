import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { usePostV3ExportsReportsId } from "generated/exports/exportsComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { ReportExportImagesModalFormData } from "pages/reports/report/components/modal/ReportExportImagesModal";
import { useCallback } from "react";
import { delay } from "services/exports";

interface IPostVariariables {
  values: ReportExportImagesModalFormData;
  params: {
    id: string;
  };
}

type IPostResponse = {
  data?: string | undefined;
};

const useReportImageExport = (
  options?: Omit<UseMutationOptions<IPostResponse, undefined, IPostVariariables>, "mutationFn">
) => {
  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync: exportReportImages } = usePostV3ExportsReportsId();

  const postExport = useCallback(
    async (variables: IPostVariariables) => {
      const checkStatus = (id: string): Promise<IPostResponse> => {
        return new Promise(async (resolve, reject) => {
          let hasFinished = false;

          try {
            do {
              const resp = await fetch(`${process.env.REACT_APP_API_CUBE_URL}/v3/exports/reports/${id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...httpAuthHeader
                }
              });

              const body: IPostResponse = await resp.json();
              if (body.data) {
                hasFinished = true;
                resolve(body as IPostResponse);
              }
              await delay(3000);
            } while (!hasFinished);
          } catch (err) {
            reject(err);
          }
        });
      };

      // Do request
      const { data } = await exportReportImages({
        body: {
          ...variables.values
        },
        pathParams: {
          ...variables.params
        },
        headers: httpAuthHeader
      });

      return await checkStatus(data || "");
    },
    [exportReportImages, httpAuthHeader]
  );

  return useMutation<IPostResponse, undefined, IPostVariariables>(postExport, options);
};

export default useReportImageExport;
