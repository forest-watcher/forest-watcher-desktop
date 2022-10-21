import ToggleGroup from "components/ui/Form/ToggleGroup";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

export interface IProps {}

const ShowOpenAssignmentsControlToggle: FC<IProps> = props => {
  const methods = useFormContext();
  const intl = useIntl();

  return (
    <>
      {/* Used <ToggleGroup /> instead of <Toggle /> to match styling */}
      <ToggleGroup
        id="show-open-assignments-toggle"
        toggleGroupProps={{
          options: [
            {
              label: intl.formatMessage({ id: "reporting.control.panel.investigation.toggle.openAssignments" }),
              value: "true"
            }
          ],
          defaultValue: ["true"]
        }}
        formHook={methods}
        registered={methods.register("showOpenAssignments")}
      />
    </>
  );
};

export default ShowOpenAssignmentsControlToggle;
