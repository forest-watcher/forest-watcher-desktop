import ToggleGroup from "components/ui/Form/ToggleGroup";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

export interface IProps {}

const ShowAlertsControl: FC<IProps> = props => {
  const methods = useFormContext();
  const intl = useIntl();

  return (
    <ToggleGroup
      id="show-alerts-toggle"
      toggleGroupProps={{
        label: intl.formatMessage({ id: "layers.name" }),
        options: [
          {
            label: intl.formatMessage({ id: "reporting.control.panel.investigation.toggle.alert" }),
            value: "show-alerts"
          }
        ]
      }}
      formHook={methods}
      registered={methods.register("layers")}
    />
  );
};

export default ShowAlertsControl;
