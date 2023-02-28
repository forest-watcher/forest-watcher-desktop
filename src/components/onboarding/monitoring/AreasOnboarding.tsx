import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useIntl } from "react-intl";
import OnboardingModal, { OnboardingStep } from "../OnboardingModal";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import AddAreasImage from "assets/images/onboarding/add-areas.png";
import MonitorAreasImage from "assets/images/onboarding/monitor-areas.png";
import ReviewTeamsImage from "assets/images/onboarding/review-teams.png";

const AreasOnboarding = () => {
  const { get, set } = useLocalStorage();
  const [show, setShow] = useState<boolean>(false);
  const intl = useIntl();

  const steps = useMemo<OnboardingStep[]>(
    () => [
      {
        heading: intl.formatMessage({ id: "what.new.1.heading" }),
        title: intl.formatMessage({ id: "what.new.1.title" }),
        text: intl.formatMessage({ id: "what.new.1.text" }),
        imageUrl: AddAreasImage
      },
      {
        heading: intl.formatMessage({ id: "what.new.2.heading" }),
        title: intl.formatMessage({ id: "what.new.2.title" }),
        text: intl.formatMessage({ id: "what.new.2.text" }),
        imageUrl: MonitorAreasImage
      },
      {
        heading: intl.formatMessage({ id: "what.new.3.heading" }),
        title: intl.formatMessage({ id: "what.new.3.title" }),
        text: intl.formatMessage({ id: "what.new.3.text" }),
        imageUrl: ReviewTeamsImage
      }
    ],
    [intl]
  );

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
