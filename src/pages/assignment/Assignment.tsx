import { FC, useEffect, useMemo, useState } from "react";
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
import { getAlertText } from "helpers/assignments";
import CreateAssignmentForm from "pages/reports/investigation/control-panels/CreateAssignment/states/AssignmentForm";
import classNames from "classnames";
import { Map as MapType } from "mapbox-gl";

export type TParams = {
  id: string;
};

const Assignment: FC = props => {
  const { id } = useParams<TParams>();
  let { path, url } = useRouteMatch();
  const [map, setMap] = useState<MapType | null>(null);
  const isEdit = useRouteMatch(`${path}/edit`);
  const { httpAuthHeader } = useAccessToken();
  const { data, isLoading, refetch } = useGetV3GfwAssignmentsAssignmentId({
    pathParams: { assignmentId: id },
    headers: httpAuthHeader
  });
  const userId = useGetUserId();
  const intl = useIntl();
  const templates = useMemo(() => {
    const templates = data?.data?.attributes?.templates || [];

    return templates
      .map(template => (template?.name ? template.name[template.defaultLanguage as keyof typeof template.name] : ""))
      .filter(name => name !== "")
      .join(", ");
  }, [data?.data?.attributes?.templates]);

  const isMyAssignment = data?.data?.attributes?.createdBy === userId;
  const isComplete = data?.data?.attributes?.status === "completed";

  useEffect(() => {
    map?.resize();
  }, [isEdit, map]);

  return (
    <div className={classNames(isEdit ? "l-full-page-map" : "relative")}>
      <Hero
        title={isEdit ? "assignment.edit" : "assignment.title"}
        backLink={!isEdit ? { name: "assignment.details.back", to: "/reporting/assignments" } : undefined}
        actions={
          <OptionalWrapper data={isEdit === null}>
            {isMyAssignment && !isComplete && (
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
          </OptionalWrapper>
        }
      />
      <LoadingWrapper loading={isLoading}>
        <Map
          className={classNames(isEdit ? "h-full" : "c-map--within-hero")}
          hideSearch
          onMapLoad={e => setMap(e.target)}
        >
          <MapLayers assignment={data?.data} />
          <Switch>
            <Route path={`${path}/edit`}>
              <LoadingWrapper loading={isLoading}>
                <CreateAssignmentForm
                  setShowCreateAssignmentForm={() => {}}
                  setShapeFileGeoJSON={() => {}}
                  assignmentToEdit={data}
                  onFinish={refetch}
                />
              </LoadingWrapper>
            </Route>
          </Switch>
        </Map>
        <OptionalWrapper data={Boolean(data) && !isEdit}>
          <Article
            title="assignment.details.name"
            titleValues={{ name: data?.data?.attributes?.name || "" }}
            className="mt-15 mb-20"
          >
            <div className="grid grid-cols-1 600:grid-cols-2 800:grid-cols-3 gap-7 auto-rows-min">
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
                shouldCollapse
              />
              <DetailCard
                icon={assignmentIcons.status}
                title={intl.formatMessage({ id: "assignment.details.status" })}
                text={data?.data?.attributes?.status}
                shouldCollapse
              />
              <DetailCard
                icon={assignmentIcons.assignmentType}
                title={intl.formatMessage({ id: "assignment.details.assignmentType" })}
                text={getAlertText(data?.data, intl)}
                shouldCollapse
              />
              <DetailCard
                icon={assignmentIcons.templates}
                title={intl.formatMessage({ id: "assignment.details.templates" })}
                text={templates}
                shouldCollapse
              />
              <DetailCard
                icon={assignmentIcons.monitor}
                title={intl.formatMessage({ id: "assignment.details.monitor" })}
                text={data?.data?.attributes?.monitorNames?.map(monitor => monitor.name).join(", ")}
                shouldCollapse
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
