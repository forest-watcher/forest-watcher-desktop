import { FC, useMemo } from "react";
import Hero from "components/layouts/Hero/Hero";
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import Article from "components/layouts/Article";
import Map from "components/ui/Map/Map";
import { FormattedMessage, useIntl } from "react-intl";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import DetailCard from "components/ui/Card/DetailCard";
import { useGetV3GfwAssignmentsAssignmentId } from "generated/core/coreComponents";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { useAccessToken } from "hooks/useAccessToken";
import assignmentIcons from "assets/images/icons/assignmentIcons";
import MapLayers from "./components/MapLayers";
import DeleteAssignment from "./components/DeleteAssignment";
import useGetUserId from "hooks/useGetUserId";

export type TParams = {
  id: string;
};

const Assignment: FC = props => {
  const { id } = useParams<TParams>();
  let { path, url } = useRouteMatch();
  const { httpAuthHeader } = useAccessToken();
  const { data, isLoading } = useGetV3GfwAssignmentsAssignmentId({
    pathParams: { assignmentId: id },
    headers: httpAuthHeader
  });
  const userId = useGetUserId();
  const intl = useIntl();
  const templates = useMemo(() => {
    const templates = data?.data?.attributes?.templates || [];

    return templates
      .map(template => (template.name ? template.name[template.defaultLanguage as keyof typeof template.name] : ""))
      .filter(name => name !== "")
      .join(", ");
  }, [data?.data?.attributes?.templates]);

  const alerts = useMemo(() => {
    const alertType = data?.data?.attributes?.location;

    if (!alertType || alertType?.length === 0) {
      return intl.formatMessage({ id: "layers.none" });
    }

    const valueStr = alertType
      // @ts-ignore - incorrect typing
      .map(alert => (alert.alertType ? intl.formatMessage({ id: `layers.${alert.alertType}` }) : ""))
      .filter(name => name !== "")
      .join(", ");

    return valueStr.length ? valueStr : intl.formatMessage({ id: "layers.none" });
  }, [data?.data?.attributes?.location, intl]);

  const isMyAssignment = data?.data?.attributes?.createdBy === userId;

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
      <Map className="c-map--within-hero">
        <MapLayers assignment={data?.data} />
      </Map>
      <LoadingWrapper loading={isLoading}>
        <OptionalWrapper data={Boolean(data)}>
          <Article
            title="assignment.details.name"
            titleValues={{ name: data?.data?.attributes?.name || "" }}
            className="mt-15 mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              <DetailCard
                icon={assignmentIcons.creation}
                title={intl.formatMessage({ id: "assignment.details.creation" })}
                text={intl.formatDate(data?.data?.attributes?.createdAt, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              />
              <DetailCard
                icon={assignmentIcons.areas}
                title={intl.formatMessage({ id: "assignment.details.area" })}
                text={data?.data?.attributes?.areaName}
              />
              <DetailCard
                icon={assignmentIcons.status}
                title={intl.formatMessage({ id: "assignment.details.status" })}
                text={data?.data?.attributes?.status}
              />
              <DetailCard
                icon={assignmentIcons.assignmentType}
                title={intl.formatMessage({ id: "assignment.details.assignmentType" })}
                text={alerts}
              />
              <DetailCard
                icon={assignmentIcons.templates}
                title={intl.formatMessage({ id: "assignment.details.templates" })}
                text={templates}
              />
              <DetailCard
                icon={assignmentIcons.monitor}
                title={intl.formatMessage({ id: "assignment.details.monitor" })}
                text={data?.data?.attributes?.monitorNames?.map(monitor => monitor.name).join(", ")}
              />
              <DetailCard
                icon={assignmentIcons.notes}
                title={intl.formatMessage({ id: "assignment.details.notes" })}
                text={data?.data?.attributes?.notes}
                shouldCollapse
              />
            </div>
          </Article>
        </OptionalWrapper>
      </LoadingWrapper>
      <Switch>
        <Route path={`${path}/delete`}>
          <DeleteAssignment />
        </Route>
      </Switch>
    </div>
  );
};

export default Assignment;
