import ToggleGroup from "components/ui/Form/ToggleGroup";
import Select from "components/ui/Form/Select";
import { DefaultRequestThresholds, EAlertTypes, ViirsRequestThresholds } from "constants/alerts";
import { FC, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

export interface IProps {}

const ShowAlertsControl: FC<IProps> = props => {
  const methods = useFormContext();
  const intl = useIntl();

  const alertTypesShownOptions = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: "alerts.all.deforestation.alerts" }),
        value: "all"
      },
      ...Object.values(EAlertTypes).map(alertType => ({
        label: intl.formatMessage({ id: `alerts.${alertType}` }),
        value: alertType
      }))
    ],
    [intl]
  );

  const alertTypesRequestThresholdOptions = useMemo(
    () => ({
      default: DefaultRequestThresholds.map(requestThreshold => ({
        label: intl.formatMessage({ id: requestThreshold.labelKey }),
        value: requestThreshold.requestThreshold
      })),
      viirs: ViirsRequestThresholds.map(requestThreshold => ({
        label: intl.formatMessage({ id: requestThreshold.labelKey }),
        value: requestThreshold.requestThreshold
      }))
    }),
    [intl]
  );

  return (
    <>
      {/* Used <ToggleGroup /> instead of <Toggle /> to match styling */}
      <ToggleGroup
        id="show-alerts-toggle"
        toggleGroupProps={{
          options: [
            {
              label: intl.formatMessage({ id: "reporting.control.panel.investigation.toggle.alert" }),
              value: "true"
            }
          ],
          defaultValue: ["true"]
        }}
        formHook={methods}
        registered={methods.register("showAlerts")}
      />

      {methods.getValues("showAlerts").includes("true") && (
        <>
          <Select
            id="alert-types-shown"
            className="u-margin-bottom-small"
            formHook={methods}
            registered={methods.register("alertTypesShown")}
            selectProps={{
              placeholder: intl.formatMessage({ id: "maps.period" }),
              options: alertTypesShownOptions,
              alternateLabelStyle: true,
              defaultValue: alertTypesShownOptions[0]
            }}
          />

          {methods.getValues("alertTypesShown") !== EAlertTypes.viirs ? (
            <Select
              id="alert-types-timeframes"
              className="u-margin-bottom"
              formHook={methods}
              registered={methods.register("alertTypesRequestThreshold")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.period" }),
                options: alertTypesRequestThresholdOptions.default,
                alternateLabelStyle: true,
                defaultValue: alertTypesRequestThresholdOptions.default[0]
              }}
            />
          ) : (
            <Select
              id="alert-types-viirs-timeframes"
              className="u-margin-bottom"
              formHook={methods}
              registered={methods.register("alertTypesViirsRequestThreshold")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.period" }),
                options: alertTypesRequestThresholdOptions.viirs,
                alternateLabelStyle: true,
                defaultValue: alertTypesRequestThresholdOptions.viirs[0]
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ShowAlertsControl;
