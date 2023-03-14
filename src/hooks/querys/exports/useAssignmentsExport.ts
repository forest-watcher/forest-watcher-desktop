/**
 * See ../README.md for more detials on this hook.
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TExportForm } from "components/modals/exports/ExportModal";
import { ASSIGNMENT_FIELDS } from "constants/export";
import { usePostV3ExportsAssignmentsExportSome } from "generated/exports/exportsComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useCallback } from "react";
import { UnpackNestedValue } from "react-hook-form";
import { delay } from "services/exports";

interface IPostVariariables {
  values: UnpackNestedValue<TExportForm>;
  assignmentIds: string[];
}

type IPostResponse = {
  data?: string | undefined;
};

const useAssignmentsExport = (
  options?: Omit<UseMutationOptions<IPostResponse, undefined, IPostVariariables>, "mutationFn">
) => {
  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync: exportAssignments } = usePostV3ExportsAssignmentsExportSome();

  const postExport = useCallback(
    async (variables: IPostVariariables) => {
      const checkStatus = (id: string): Promise<IPostResponse> => {
        return new Promise(async (resolve, reject) => {
          let hasFinished = false;

          try {
            do {
              const resp = await fetch(`${process.env.REACT_APP_API_CUBE_URL}/v3/exports/assignments/${id}`, {
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
      const { data } = await exportAssignments({
        body: {
          ...variables.values,
          fields: ASSIGNMENT_FIELDS,
          // @ts-ignore incorrect typings in docs
          ids: variables.assignmentIds || []
        },
        headers: httpAuthHeader
      });

      return await checkStatus(data || "");
    },
    [exportAssignments, httpAuthHeader]
  );

  return useMutation<IPostResponse, undefined, IPostVariariables>(postExport, options);
};

export default useAssignmentsExport;
