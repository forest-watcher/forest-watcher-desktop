import Icon from "components/extensive/Icon";
import List from "components/extensive/List";
import Button from "components/ui/Button/Button";
import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface IProps {}

const OpenAssignmentEmptyState: FC<IProps> = props => {
  const {} = props;
  const intl = useIntl();

  return (
    <div className="rounded-md bg-gray-400 px-4 py-6 flex flex-col items-center gap-y-6">
      <Icon name="flag" />

      <h1 className="text-lg text-gray-700 text-center">
        <FormattedMessage id="assignments.empty.title" />
      </h1>

      <List<{ text: string }>
        className="flex flex-col text-base text-gray-700 gap-y-4"
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
  );
};

export default OpenAssignmentEmptyState;
