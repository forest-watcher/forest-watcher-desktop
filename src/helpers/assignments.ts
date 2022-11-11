export const priorityToString = (priority?: number): string => {
  return priority && priority > 0 ? "assignments.priority.high" : "assignments.priority.normal";
};
