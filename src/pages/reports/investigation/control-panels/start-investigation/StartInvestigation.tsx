import { AnswersResponse } from "generated/core/coreResponses";
import ShowAlertsControl from "pages/reports/investigation/control-panels/start-investigation/controls/ShowAlerts";
import ShowOpenAssignments from "pages/reports/investigation/control-panels/start-investigation/controls/ShowOpenAssignments";
import { TFormValues } from "pages/reports/investigation/Investigation";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toastr } from "react-redux-toastr";
import { TParams } from "pages/reports/investigation/types";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import { useFormContext, useWatch } from "react-hook-form";
import DataFilter from "components/ui/DataFilter/DataFilter";
import useControlPanelReportFilters from "pages/reports/reports/useControlPanelReportFilters";
import useFindArea from "hooks/useFindArea";
import { fireGAEvent } from "helpers/analytics";
import { MapActions } from "types/analytics";
import { TFilterFields } from "pages/reports/reports/Reports";
import ShowRoutesControl from "./controls/ShowRoutesControl";
import Icon from "components/extensive/Icon";
import Basemaps from "./controls/Basemaps";
import { useGetV3ContextualLayer } from "generated/clayers/clayersComponents";
import { useAccessToken } from "hooks/useAccessToken";
import useGetAreas from "hooks/querys/areas/useGetAreas";
import { useIsFetching } from "@tanstack/react-query";
import useUrlQuery from "hooks/useUrlQuery";

export enum LAYERS {
  reports = "reports"
}

interface IProps {
  onFilterUpdate: (answers: AnswersResponse["data"]) => void;
  answers?: AnswersResponse["data"];
  defaultBasemap?: string;
  onComparison: (value: boolean) => void;
}

const StartInvestigationControlPanel: FC<IProps> = props => {
  const history = useHistory();
  const location = useLocation();
  const { areaId } = useParams<TParams>();
  const { answers, onFilterUpdate, defaultBasemap, onComparison } = props;
  const [filteredRows, setFilteredRows] = useState<any>(answers);
  const { httpAuthHeader } = useAccessToken();
  const isFetchingAlerts = useIsFetching(["areaAlerts"]);
  const urlQuery = useUrlQuery();
  const teamId = useMemo(() => urlQuery.get("teamId"), [urlQuery]);

  useEffect(() => {
    setFilteredRows(answers);
  }, [answers]);

  const {
    data: { unfilteredAreas: areas },
    isFetching: isLoadingAreas
  } = useGetAreas({ refetchOnWindowFocus: false });

  const { data: layersData } = useGetV3ContextualLayer({ headers: httpAuthHeader });

  const layersOptions = useMemo(() => {
    return (
      layersData?.data
        .filter(layer => layer?.attributes?.enabled)
        .filter(
          layer =>
            layer?.attributes?.owner.type === "USER" ||
            // @ts-ignore - owner.id missing from types
            (layer?.attributes?.owner.type === "TEAM" && layer?.attributes?.owner.id === teamId)
        )
        .filter((value, index, self) => self.findIndex(t => t.attributes?.url === value.attributes?.url) === index)
        .map(layer => ({
          option: layer.id,
          label: layer?.attributes?.name
        })) || []
    );
  }, [layersData?.data, teamId]);

  const { area, resp: areaResp } = useFindArea(areaId);

  const intl = useIntl();

  const { filters } = useControlPanelReportFilters(answers);

  const methods = useFormContext<TFormValues>();
  const { register, control } = methods;

  const watcher = useWatch({ control });

  const handleBackBtnClick = useCallback(() => {
    history.push(`/reporting/investigation/${areaId}${teamId ? `?scrollToTeamId=${teamId}` : ""}`);
  }, [history, areaId, teamId]);

  useEffect(() => {
    if (areaResp.isError) {
      toastr.warning(intl.formatMessage({ id: "reporting.investigation.error" }), "");
      handleBackBtnClick();
    }
  });

  useEffect(() => {
    onFilterUpdate(filteredRows);
  }, [filteredRows, onFilterUpdate]);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage(
        { id: "reporting.control.panel.investigation.title" },
        { area: area?.attributes?.name }
      )}
      onBack={handleBackBtnClick}
      footer={
        <Link to={`${location.pathname}/assignment`} className="c-button c-button--primary">
          <Icon size={18} name="PlusWhite" className="pr-[6px] my-[-1px]" />
          <FormattedMessage id="assignment.create.new" />
        </Link>
      }
    >
      <Loader isLoading={(isLoadingAreas && !areas) || isFetchingAlerts > 0} />

      <form>
        <Basemaps defaultBasemap={defaultBasemap} onComparison={onComparison} />
        <ShowAlertsControl />
        <ToggleGroup
          id="layer-toggles"
          registered={register("layers")}
          formHook={methods}
          toggleGroupProps={{
            options: [
              {
                label: intl.formatMessage({ id: "reporting.control.panel.investigation.options.completedReports" }),
                value: LAYERS.reports
              }
            ]
          }}
        />
        {answers && Boolean(watcher.layers?.length) && (
          <DataFilter<TFilterFields, any>
            filters={filters}
            onFiltered={setFilteredRows}
            options={answers}
            className="c-data-filter--in-control-panel u-margin-bottom-20"
          />
        )}

        <ShowOpenAssignments />
        <ShowRoutesControl />

        {Boolean(layersOptions.length) && (
          <ToggleGroup
            id="contextual-layer-toggles"
            registered={register("contextualLayers")}
            formHook={methods}
            hideLabel
            toggleGroupProps={{
              label: intl.formatMessage({ id: "layers.contextual" }),
              options: layersOptions.map((layer: any) => ({
                label: intl.formatMessage({ id: layer.label }),
                value: layer.option
              }))
            }}
            onChange={(option, enabled) => {
              enabled &&
                fireGAEvent({
                  category: "Map",
                  action: MapActions.Layers,
                  label: option.label
                });
            }}
          />
        )}
      </form>
    </MapCard>
  );
};

export default StartInvestigationControlPanel;
