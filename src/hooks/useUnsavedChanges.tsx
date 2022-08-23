import UnsavedChanges from "components/modals/UnsavedChanges";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const useUnsavedChanges = (blockingCondition: boolean) => {
  const history = useHistory();
  const [isBlockingNavigation, setIsBlockingNavigation] = useState(false);
  const [attemptedLocation, setAttemptedLocation] = useState<any>(null);
  const unblockRef = useRef<any>();

  useEffect(() => {
    // @ts-ignore typing issue with history.block
    unblockRef.current = history.block(location => {
      if (blockingCondition) {
        setIsBlockingNavigation(true);
        setAttemptedLocation(location);
        return false;
      }
      setIsBlockingNavigation(false);
      return true;
    });

    return () => {
      // Unblock on condition changing.
      unblockRef.current && unblockRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockingCondition]);

  return {
    modal: (
      <UnsavedChanges
        isOpen={isBlockingNavigation}
        leaveCallBack={() => {
          // Unblock and navigate when leaving
          unblockRef.current && unblockRef.current();
          history.push(attemptedLocation);
        }}
        stayCallBack={() => setIsBlockingNavigation(false)}
      />
    ),
    isBlockingNavigation
  };
};

export default useUnsavedChanges;
