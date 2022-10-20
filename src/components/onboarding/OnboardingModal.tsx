import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "components/ui/Button/Button";
import CloseIcon from "assets/images/icons/CloseLg.svg";
import OptionalWrapper from "components/extensive/OptionalWrapper";

export interface OnboardingStep {
  heading: string;
  imageUrl?: string;
  title: string;
  text: string;
  onNextClick?: () => void;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  steps: OnboardingStep[];
}

const OnboardingModal = ({ isOpen, steps, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNextClick = () => {
    const currStep = steps[currentStep];
    setCurrentStep(prev => prev + 1);

    if (currStep.onNextClick) return currStep.onNextClick();
  };

  const handleBackClick = () => {
    return setCurrentStep(prev => prev - 1);
  };

  const _renderNextButtonText = useMemo(() => {
    if (currentStep === steps.length - 1) return "Get Started";
    return "Continue";
  }, [currentStep]);

  const step = useMemo(() => steps[currentStep], [currentStep]);

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      enterFrom="c-modal-dialog--animate"
      leaveTo="c-modal-dialog--animate"
    >
      <Dialog className="c-modal-dialog__container" onClose={onClose ? onClose : () => {}}>
        <div className="c-modal-dialog__backdrop" aria-hidden="true" />

        <Dialog.Panel className="c-modal-dialog">
          <OptionalWrapper data={!!onClose}>
            <div className="flex justify-end items-center px-[60px] pt-[40px]">
              <button className="c-button c-modal-dialog__close-btn" onClick={onClose}>
                <img alt="" src={CloseIcon} role="presentation" />
              </button>
            </div>
          </OptionalWrapper>

          <div className="c-modal-dialog__body border-b-0">
            <h3 className="text-3xl font-[300] text-gray-700 text-center capitalize">{step.heading}</h3>
            <OptionalWrapper data={!!step.imageUrl}>
              <div className="bg-green-500 py-[21.5px] rounded-md mb-5 flex items-center justify-center"></div>
            </OptionalWrapper>
            <div className="text-center">
              <h4 className="text-[24px] font-[400] text-gray-700">{step.title}</h4>
              <p className="font-[400] text-[18px] text-gray-700">{step.text}</p>
            </div>
          </div>

          <div className="c-modal-dialog__actions relative">
            <Button onClick={handleNextClick}>{_renderNextButtonText}</Button>
            <div className="absolute top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%]">
              {currentStep + 1}
            </div>
            <OptionalWrapper data={currentStep !== 0}>
              <Button onClick={handleBackClick} variant="secondary">
                Back
              </Button>
            </OptionalWrapper>
          </div>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default OnboardingModal;
