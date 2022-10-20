import { OnboardingStep } from "./OnboardingModal";

type OnboardingModalContentProps = {
  step: OnboardingStep;
};

const OnboardingModalContent = ({ step }: OnboardingModalContentProps) => {
  return (
    <div className="c-modal-dialog__body border-b-0">
      <h3 className="text-3xl font-[300] text-gray-700 text-center capitalize p-0 mb-[24px]">{step.heading}</h3>

      <div className="bg-green-500 py-[21.5px] rounded-md mb-5 flex items-center justify-center">
        <img src={step.imageUrl} alt={step.title} />
      </div>

      <div className="text-center mt-[24px]">
        <h4 className="text-[24px] font-[400] text-gray-700">{step.title}</h4>
        <p className="font-[400] text-[18px] text-gray-700">{step.text}</p>
      </div>
    </div>
  );
};

export default OnboardingModalContent;
