import ToggleGroup from "components/ui/Form/ToggleGroup";
import { useFormContext } from "react-hook-form";

const ShowRoutesControl = () => {
  const methods = useFormContext();

  return (
    <ToggleGroup
      id="show-routes-toggle"
      toggleGroupProps={{
        options: [
          {
            label: "Routes",
            value: "true"
          }
        ],
        defaultValue: ["false"]
      }}
      formHook={methods}
      registered={methods.register("showRoutes")}
    />
  );
};

export default ShowRoutesControl;
