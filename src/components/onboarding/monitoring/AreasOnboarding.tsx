import { useEffect, useState } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import OnboardingModal, { OnboardingStep } from "../OnboardingModal";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import AddAreasImage from "../../../assets/images/onboarding/add-areas.png";
import MonitorAreasImage from "../../../assets/images/onboarding/monitor-areas.png";
import ReviewTeamsImage from "../../../assets/images/onboarding/review-teams.png";

const steps: OnboardingStep[] = [
  {
    heading: "New in this version",
    title: "Add Areas",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique enim ac eros pellentesque commodo. Nullam sit amet rutrum risus. Donec mollis lectus ullamcorper pretium faucibus. Cras velit lorem, mollis ac placerat vel, fermentum eleifend tellus. ",
    imageUrl: AddAreasImage
  },
  {
    heading: "New in this version",
    title: "Monitor Areas",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique enim ac eros pellentesque commodo. Nullam sit amet rutrum risus. Donec mollis lectus ullamcorper pretium faucibus. Cras velit lorem, mollis ac placerat vel, fermentum eleifend tellus. ",
    imageUrl: MonitorAreasImage
  },
  {
    heading: "New in this version",
    title: "Review Teams",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique enim ac eros pellentesque commodo. Nullam sit amet rutrum risus. Donec mollis lectus ullamcorper pretium faucibus. Cras velit lorem, mollis ac placerat vel, fermentum eleifend tellus. ",
    imageUrl: ReviewTeamsImage
  }
];

const AreasOnboarding = () => {
  const { get, set } = useLocalStorage();
  const [show, setShow] = useState<boolean>(false);

  /**
   * Handles check onboarded in LS and conditionally show Monitoring onboarding.
   */
  useEffect(() => {
    const storedKey = "onboarding";
    const onboarded = get(storedKey);

    if (!onboarded) {
      setShow(true);
      return set(storedKey, "true");
    }
    return setShow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OptionalWrapper data={show} elseComponent={<></>}>
      <OnboardingModal isOpen onClose={() => setShow(false)} steps={steps} />
    </OptionalWrapper>
  );
};

export default AreasOnboarding;
