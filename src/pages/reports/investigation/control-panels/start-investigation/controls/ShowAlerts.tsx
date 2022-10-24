import ToggleGroup from "components/ui/Form/ToggleGroup";
import Select from "components/ui/Form/Select";
import { EAlertTypes } from "constants/alerts";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

export interface IProps {}

const alertTypesShownOptions = [
  {
    label: "All Deforestation Alerts",
    value: "all"
  },
  ...Object.values(EAlertTypes).map(alertType => ({
    label: alertType,
    value: alertType
  }))
];

const ShowAlertsControl: FC<IProps> = props => {
  const methods = useFormContext();
  const intl = useIntl();

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
              registered={methods.register("alertTypesTimeframes")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.period" }),
                options: [{ label: "Test", value: 1 }],
                alternateLabelStyle: true,
                defaultValue: { label: "Test", value: 1 }
              }}
            />
          ) : (
            <Select
              id="alert-types-viirs-timeframes"
              className="u-margin-bottom"
              formHook={methods}
              registered={methods.register("alertTypesViirsTimeframes")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.period" }),
                options: [{ label: "Test2", value: 1 }],
                alternateLabelStyle: true,
                defaultValue: { label: "Test2", value: 1 }
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ShowAlertsControl;
