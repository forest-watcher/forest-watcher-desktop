import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { Dispatch, SetStateAction, useMemo } from "react";
import { OnboardingStep } from "./OnboardingModal";
import OnboardingModalNavigation from "./OnboardingModalNavigation";

type OnboardingModalFooterProps = {
  onClose: () => void;
  steps: OnboardingStep[];
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const OnboardingModalFooter = ({ onClose, steps, currentStep, setCurrentStep }: OnboardingModalFooterProps) => {
  /**
   * Handle Next Click Button Event.
   * @returns void
   */
  const handleNextClick = () => {
    const currStep = steps[currentStep];
    const isLast = currentStep === steps.length - 1;

    if (isLast) return onClose();

    setCurrentStep(prev => prev + 1);

    if (currStep.onNextClick) return currStep.onNextClick();
  };

  /**
   * Handle Back Click Button Event.
   * @returns void
   */
  const handleBackClick = () => {
    return setCurrentStep(prev => prev - 1);
  };

  /**
   * Renders next button text based on current step index.
   */
  const nextButtonText = useMemo(() => {
    if (currentStep === steps.length - 1) return "Get Started";
    return "Continue";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  return (
    <div className="c-modal-dialog__actions relative">
      <Button onClick={handleNextClick}>{nextButtonText}</Button>
      <OnboardingModalNavigation steps={steps} currentStep={currentStep} />
      <OptionalWrapper data={currentStep !== 0}>
        <Button onClick={handleBackClick} variant="secondary">
          Back
        </Button>
      </OptionalWrapper>
    </div>
  );
};

export default OnboardingModalFooter;
