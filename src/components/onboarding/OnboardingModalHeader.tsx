import CloseIcon from "assets/images/icons/CloseLgWithPadding.svg";
import Icon from "components/extensive/Icon";
import { useIntl } from "react-intl";

type OnboardingModalHeaderProps = {
  onClose: () => void;
};

const OnboardingModalHeader = ({ onClose }: OnboardingModalHeaderProps) => {
  const intl = useIntl();
  return (
    <div className="w-full relative">
      <button
        className="absolute top-8 right-10"
        onClick={onClose}
        aria-label={intl.formatMessage({ id: "common.close" })}
      >
        <img alt="" src={CloseIcon} role="presentation" />
      </button>

      <div className="flex items-center justify-center w-full pt-10">
        <Icon name="logo" size={70} />
      </div>
    </div>
  );
};

export default OnboardingModalHeader;
