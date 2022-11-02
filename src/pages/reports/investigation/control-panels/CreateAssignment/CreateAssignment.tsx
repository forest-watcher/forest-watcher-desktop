import CreateAssignmentForm from "pages/reports/investigation/control-panels/CreateAssignment/states/CreateAssignmentForm";
import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import OpenAssignmentEmptyState from "pages/reports/investigation/control-panels/CreateAssignment/states/EmptyState";

export interface IProps {}

const CreateAssignmentControlPanel: FC<IProps> = props => {
  const { getValues } = useFormContext();
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] = useState(false);

  useEffect(() => {
    if (getValues("selectedAlerts") && getValues("selectedAlerts").length) {
      // Skip the Empty state on initial render, if alerts have already been selected
      setShowCreateAssignmentForm(true);
    }
  }, [getValues]);

  return !showCreateAssignmentForm ? (
    <OpenAssignmentEmptyState setShowCreateAssignmentForm={setShowCreateAssignmentForm} />
  ) : (
    <CreateAssignmentForm />
  );
};

export default CreateAssignmentControlPanel;
