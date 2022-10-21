import List from "components/extensive/List";
import { OnboardingStep } from "./OnboardingModal";

type OnboardingModalNavigationProps = {
  steps: OnboardingStep[];
  currentStep: number;
};

const OnboardingModalNavigation = ({ steps, currentStep }: OnboardingModalNavigationProps) => {
  return (
    <div className="absolute top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%]">
      <div className="flex gap-2 bg-gray-300 p-5 rounded-xl">
        <List
          items={steps}
          className="flex gap-2"
          render={(_, index) => (
            <div
              className={`h-[10px] transition-all duration-300 rounded-lg ${
                currentStep === index ? "bg-green-500 w-8" : "bg-gray-500 w-3"
              }`}
            />
          )}
        />
      </div>
    </div>
  );
};

export default OnboardingModalNavigation;
