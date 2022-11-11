import { OnboardingStep } from "./OnboardingModal";

type OnboardingModalContentProps = {
  step: OnboardingStep;
};

const OnboardingModalContent = ({ step }: OnboardingModalContentProps) => {
  return (
    <div className="c-modal-dialog__body border-b-0">
      <h3 className="text-3xl font-[300] text-neutral-700 text-center capitalize p-0 mb-6">{step.heading}</h3>

      <div className="bg-green-500 py-[21.5px] rounded-md mb-10 flex items-center justify-center">
        <img src={step.imageUrl} alt={step.title} className="max-h-[197px]" />
      </div>

      <div className="text-center">
        <h4 className="text-2xl font-[400] text-neutral-700 mb-3 pb-0">{step.title}</h4>
        <p className="text-lg font-[400] text-neutral-700 mb-0">{step.text}</p>
      </div>
    </div>
  );
};

export default OnboardingModalContent;
