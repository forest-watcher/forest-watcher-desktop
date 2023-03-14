type OptionalWrapperProps = {
  children: React.ReactNode;
  data: boolean | undefined;
  elseComponent?: React.ReactNode;
};

/**
 * Simple wrapper to conditionally render children.
 * Helps with clean syntax and removes use of conditionals in jsx.
 * @param props  OptionalWrapperProps
 * @returns
 */
const OptionalWrapper = ({ children, data, elseComponent }: OptionalWrapperProps) => {
  if (!data && elseComponent) return <>{elseComponent}</>;
  if (!data) return <></>;

  return <>{children}</>;
};

export default OptionalWrapper;
