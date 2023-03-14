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
          label: intl.formatMessage({ id: "layers.name" }),
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
              defaultValue: alertTypesShownOptions[0]
            }}
            alternateLabelStyle
          />

          {methods.getValues("alertTypesShown") !== EAlertTypes.VIIRS ? (
            <Select
              id="alert-types-timeframes"
              className="u-margin-bottom"
              formHook={methods}
              registered={methods.register("alertTypesRequestThreshold")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.period" }),
                options: alertTypesRequestThresholdOptions.default,
                defaultValue: alertTypesRequestThresholdOptions.default[0]
              }}
              alternateLabelStyle
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
                defaultValue: alertTypesRequestThresholdOptions.viirs[0]
              }}
              alternateLabelStyle
            />
          )}
        </>
      )}
    </>
  );
};

export default ShowAlertsControl;
