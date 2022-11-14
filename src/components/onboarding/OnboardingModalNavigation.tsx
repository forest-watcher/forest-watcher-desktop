import List from "components/extensive/List";
import { OnboardingStep } from "./OnboardingModal";

type OnboardingModalNavigationProps = {
  steps: OnboardingStep[];
  currentStep: number;
};

const OnboardingModalNavigation = ({ steps, currentStep }: OnboardingModalNavigationProps) => {
  return (
    <div className="flex gap-2 bg-neutral-300 rounded-xl mx-auto">
      <List
        items={steps}
        className="flex gap-2"
        render={(_, index) => (
          <div
            className={`h-[10px] transition-all duration-300 rounded-lg ${
              currentStep === index ? "bg-primary-500 w-8" : "bg-neutral-500 w-3"
            }`}
          />
        )}
      />
    </div>
  );
};

export default OnboardingModalNavigation;
