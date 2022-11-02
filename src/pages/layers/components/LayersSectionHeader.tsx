import { FormattedMessage } from "react-intl";

type LayersSectionHeaderProps = {
  title: string;
  subtitle: string;
};

const LayersSectionHeader = ({ title, subtitle }: LayersSectionHeaderProps) => {
  return (
    <div>
      <h2 className="text-4xl font-[300] text-gray-700 mb-3">
        <FormattedMessage id={title} />
      </h2>
      <h4 className="text-2xl font-[400] text-gray-600">
        <FormattedMessage id={subtitle} />
      </h4>
    </div>
  );
};

export default LayersSectionHeader;
