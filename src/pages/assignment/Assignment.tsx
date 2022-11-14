import { FC } from "react";
import Hero from "components/layouts/Hero/Hero";
import Loader from "components/ui/Loader";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import Article from "components/layouts/Article";
import Map from "components/ui/Map/Map";
import { FormattedMessage } from "react-intl";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import DetailCard from "components/ui/Card/DetailCard";
import ReportsIcon from "assets/images/icons/Reports.svg";
import { useGetV3GfwAssignmentsAssignmentId } from "generated/core/coreComponents";
import OptionalWrapper from "components/extensive/OptionalWrapper";

export type TParams = {
  id: string;
};

const Assignment: FC = props => {
  const { id } = useParams<TParams>();
  let { url } = useRouteMatch();
  const { data, isLoading, isError } = useGetV3GfwAssignmentsAssignmentId({ pathParams: { assignmentId: id } });
  const isMyAssignment = true;

  console.log(data, isError);
  return (
    <div className="relative">
      <Hero
        title="assignment.title"
        backLink={{ name: "assignment.details.back", to: "/reporting/assignments" }}
        actions={
          <>
            {isMyAssignment && (
              <Link to={`${url}/edit`} className="c-button c-button--primary">
                <FormattedMessage id="common.edit" />
              </Link>
            )}
            <Link to={`${url}/export`} className="c-button c-button--secondary-light-text">
              <FormattedMessage id="common.export" />
            </Link>
            {isMyAssignment && (
              <Link to={`${url}/delete`} className="c-button c-button--secondary-light-text">
                <FormattedMessage id="common.delete" />
              </Link>
            )}
          </>
        }
      />
      <Map className="c-map--within-hero"></Map>
      <LoadingWrapper loading={isLoading}>
        <OptionalWrapper data={Boolean(data)}>
          <Article title="assignment.details.name" titleValues={{ name: "foo" }} className="mt-15 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />
              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />

              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />

              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />
              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />
              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />
              <DetailCard icon={ReportsIcon} title="hey" text="whooop" />
            </div>
          </Article>
        </OptionalWrapper>
      </LoadingWrapper>
    </div>
  );
};

export default Assignment;
