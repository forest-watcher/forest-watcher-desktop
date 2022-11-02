import Icon from "components/extensive/Icon";
import List from "components/extensive/List";
import Button from "components/ui/Button/Button";
import IconBubble from "components/ui/Icon/IconBubble";
import { Dispatch, FC, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import MapCard from "components/ui/Map/components/cards/MapCard";

export interface IProps {
  setShowCreateAssignmentForm: Dispatch<SetStateAction<boolean>>;
}

const OpenAssignmentEmptyState: FC<IProps> = props => {
  const { setShowCreateAssignmentForm } = props;
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { getValues, setValue } = useFormContext();

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "assignment.create.new" })}
      onBack={() => {
        setValue("selectedAlerts", []);
        history.push(location.pathname.replace("/assignment", ""));
      }}
      footer={
        <Button
          disabled={!(getValues("selectedAlerts") && getValues("selectedAlerts").length)}
          onClick={() => setShowCreateAssignmentForm(true)}
        >
          <FormattedMessage id="assignment.create" />
        </Button>
      }
    >
      <div className="rounded-md bg-gray-400 px-4 py-6 flex flex-col items-center">
        <IconBubble className="mb-3" name="flag-white" size={22} />

        <h1 className="text-lg text-gray-700 text-center mb-6">
          <FormattedMessage id="assignments.empty.title" />
        </h1>

        <List<{ text: string }>
          className="flex flex-col text-base text-gray-700 gap-y-4 mb-6"
          items={[
            { text: intl.formatMessage({ id: "assignments.empty.content.list.item.1" }) },
            { text: intl.formatMessage({ id: "assignments.empty.content.list.item.2" }) },
            { text: intl.formatMessage({ id: "assignments.empty.content.list.item.3" }) }
          ]}
          render={i => (
            <div>
              <Icon className="inline align-middle mr-3" size={12} name="oval" />
              {i.text}
            </div>
          )}
        />

        <Button className="bg-white w-full" variant="secondary">
          <FormattedMessage id="assignments.empty.upload.shapefile" />
        </Button>
      </div>
    </MapCard>
  );
};

export default OpenAssignmentEmptyState;
