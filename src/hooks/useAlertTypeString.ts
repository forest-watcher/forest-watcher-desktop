import { TAnswer } from "components/ui/Map/components/cards/ReportDetail";
import { getReportAlertsByName } from "helpers/reports";
import { useMemo } from "react";
import { useIntl } from "react-intl";

const useAlertTypeString = (answer?: TAnswer) => {
  const intl = useIntl();

  const alertTypesString = useMemo(() => {
    if (!answer) {
      return "";
    }

    const alerts = getReportAlertsByName(answer.reportName);
    if (alerts.length === 0) {
      return intl.formatMessage({ id: "layers.none" });
    }

    return alerts.map(alert => intl.formatMessage({ id: `layers.${alert.id}` })).join(", ");
  }, [answer, intl]);

  return alertTypesString;
};

export default useAlertTypeString;
