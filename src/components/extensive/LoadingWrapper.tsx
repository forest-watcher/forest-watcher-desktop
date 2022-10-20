import Loader from "components/ui/Loader";

type LoadingWrapperProps = {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
};

const LoadingWrapper = ({ loading, children, className }: LoadingWrapperProps) => {
  if (loading)
    return (
      <div className={className}>
        <Loader isLoading={loading} />;
      </div>
    );
  return <>{children}</>;
};

export default LoadingWrapper;
