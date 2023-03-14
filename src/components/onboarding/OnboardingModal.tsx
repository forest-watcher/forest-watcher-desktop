import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import OnboardingModalFooter from "./OnboardingModalFooter";
import OnboardingModalHeader from "./OnboardingModalHeader";
import OnboardingModalContent from "./OnboardingModalContent";

export interface OnboardingStep {
  heading: string;
  imageUrl?: string;
  title: string;
  text: string;
  onNextClick?: () => void;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: OnboardingStep[];
}

const OnboardingModal = ({ isOpen, steps, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const step = useMemo(
    () => steps[currentStep],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStep]
  );

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      enterFrom="c-modal-dialog--animate"
      leaveTo="c-modal-dialog--animate"
    >
      <Dialog className="c-modal-dialog__container" onClose={onClose}>
        <div className="c-modal-dialog__backdrop" aria-hidden="true" />

        <Dialog.Panel className="c-modal-dialog max-h-[820px]">
          <OnboardingModalHeader onClose={onClose} />
          <OnboardingModalContent step={step} />
          <OnboardingModalFooter
            onClose={onClose}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default OnboardingModal;
