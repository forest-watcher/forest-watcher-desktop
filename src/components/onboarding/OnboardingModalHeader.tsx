import CloseIcon from "assets/images/icons/CloseLg.svg";
import Icon from "components/extensive/Icon";

type OnboardingModalHeaderProps = {
  onClose: () => void;
};

const OnboardingModalHeader = ({ onClose }: OnboardingModalHeaderProps) => {
  return (
    <>
      <div className="flex justify-end items-center px-[60px] pt-[40px]">
        <button className="c-button c-modal-dialog__close-btn" onClick={onClose}>
          <img alt="" src={CloseIcon} role="presentation" />
        </button>
      </div>

      <div className="flex items-center justify-center">
        <Icon name="logo" size={70} />
      </div>
    </>
  );
};

export default OnboardingModalHeader;
