import ShowAlertsControl from "pages/reports/investigation/control-panels/start-investigation/controls/ShowAlerts";
import ShowOpenAssignments from "pages/reports/investigation/control-panels/start-investigation/controls/ShowOpenAssignments";
import { TFormValues } from "pages/reports/investigation/Investigation";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toastr } from "react-redux-toastr";
import { useAppSelector } from "hooks/useRedux";
import { TParams } from "pages/reports/investigation/types";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import { useFormContext, useWatch } from "react-hook-form";
import { TPropsFromRedux } from "pages/reports/investigation/control-panels/start-investigation/StartInvestigationContainer";
import DataFilter from "components/ui/DataFilter/DataFilter";
import useControlPanelReportFilters from "pages/reports/reports/useControlPanelReportFilters";
import { TGetAllAnswers } from "services/reports";
import useFindArea from "hooks/useFindArea";
import { fireGAEvent } from "helpers/analytics";
import { MapActions } from "types/analytics";
import { TFilterFields } from "pages/reports/reports/Reports";
import ShowRoutesControl from "./controls/ShowRoutesControl";
import Icon from "components/extensive/Icon";
import Basemaps from "./controls/Basemaps";

export enum LAYERS {
  reports = "reports"
}

interface IProps extends TPropsFromRedux {
  onFilterUpdate: (answers: TGetAllAnswers["data"]) => void;
  answers?: TGetAllAnswers["data"];
  defaultBasemap?: string;
}

const StartInvestigationControlPanel: FC<IProps> = props => {
  const history = useHistory();
  const location = useLocation();
  const { areaId } = useParams<TParams>();
  const { answers, onFilterUpdate, layersOptions, getLayers, defaultBasemap } = props;
  const [filteredRows, setFilteredRows] = useState<any>(answers);

  useEffect(() => {
    setFilteredRows(answers);
  }, [answers]);

  const {
    data: areas,
    loading: isLoadingAreas,
    loadingAreasInUsers: isLoadingTeamAreas
  } = useAppSelector(state => state.areas);
  const { loading: isLoadingAnswers } = useAppSelector(state => state.reports);
  const area = useFindArea(areaId);

  const selectedAreaGeoData = useMemo(() => area?.attributes.geostore.geojson, [area]);
  const intl = useIntl();

  const { filters } = useControlPanelReportFilters(answers);

  const methods = useFormContext<TFormValues>();
  const { register, control } = methods;

  const watcher = useWatch({ control });

  const handleBackBtnClick = useCallback(() => {
    history.push(`/reporting/investigation/${areaId}`);
  }, [history, areaId]);

  useEffect(() => {
    // If the areas has been fetched, and the selected Area Geo Data hasn't
    // been found then return to reporting/investigation as the areaId is invalid
    if (!selectedAreaGeoData && areaId && Object.keys(areas).length) {
      toastr.warning(intl.formatMessage({ id: "reporting.investigation.error" }), "");
      handleBackBtnClick();
    }
  }, [selectedAreaGeoData, areaId, areas, handleBackBtnClick, intl]);

  useEffect(() => {
    onFilterUpdate(filteredRows);
  }, [filteredRows, onFilterUpdate]);

  useEffect(() => {
    getLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "reporting.control.panel.investigation.title" }, { area: area?.attributes.name })}
      onBack={handleBackBtnClick}
      footer={
        <Link to={`${location.pathname}/assignment`} className="c-button c-button--primary">
          <Icon name="PlusWhite" className="pr-[6px]" />
          <FormattedMessage id="assignment.create.new" />
        </Link>
      }
    >
      <Loader isLoading={isLoadingAreas || isLoadingAnswers || isLoadingTeamAreas} />

      <form>
        <Basemaps defaultBasemap={defaultBasemap} />
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

        {layersOptions.length && (
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
