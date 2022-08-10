import Hero from "components/layouts/Hero/Hero";
import Map from "components/ui/Map/Map";
import { FC, useState, MouseEvent, ChangeEvent, useEffect, useMemo, useCallback } from "react";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import { TPropsFromRedux } from "./AreaEditContainer";
import { FeatureCollection } from "geojson";
import Input from "components/ui/Form/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "components/ui/Button/Button";
import { toastr } from "react-redux-toastr";
import { CATEGORY, ACTION } from "constants/analytics";
import union from "@turf/union";
import InfoIcon from "assets/images/icons/Info.svg";
import { goToGeojson } from "helpers/map";
import Loader from "components/ui/Loader";
import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import useUnsavedChanges from "hooks/useUnsavedChanges";
import Modal from "components/ui/Modal/Modal";
import DeleteArea from "./actions/DeleteAreaContainer";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { AREA_EXPORT_FILE_TYPES } from "constants/export";
import { exportService } from "services/exports";
import { Source, Layer } from "react-map-gl";
import { labelStyle } from "components/ui/Map/components/layers/styles";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";

const areaTitleKeys = {
  manage: "areas.editArea",
  create: "areas.createArea"
};

interface IProps extends TPropsFromRedux {}

type FormValues = {
  name: string;
};

const schema = yup
  .object({
    name: yup.string().required()
  })
  .required();

const AreaEdit: FC<IProps> = ({
  mode,
  geojson,
  getGeoFromShape,
  setSaving,
  saveAreaWithGeostore,
  saveArea,
  area,
  loading,
  saving
}) => {
  const { register, handleSubmit, watch, formState, reset, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });
  const { name } = watch();
  const [updatedGeojson, setUpdatedGeojson] = useState<FeatureCollection | null>(null);
  const [isValidatingShapefile, setIsValidatingShapefile] = useState(false);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [drawRef, setDrawRef] = useState<MapboxDraw | null>(null);
  const [showLabel, setShowLabel] = useState(true);
  const [shouldUseChangesMade, setShouldUseChangesMade] = useState(true);
  const [showShapeFileHelpModal, setShowShapeFileHelpModal] = useState(false);
  const history = useHistory();
  const intl = useIntl();
  let { path, url } = useRouteMatch();

  const { changesMade, changesValid } = useMemo(() => {
    const changesValid =
      formState.errors.name === undefined && (updatedGeojson ? updatedGeojson.features.length > 0 : true);

    const changesMade = area?.attributes.name !== name || updatedGeojson !== null;

    return { changesMade, changesValid };
  }, [area?.attributes.name, formState.errors.name, name, updatedGeojson]);

  const { modal } = useUnsavedChanges(shouldUseChangesMade ? changesMade : false);

  useEffect(() => {
    if (area?.attributes?.name) {
      setValue("name", area.attributes.name);
    }
  }, [area?.attributes?.name, setValue]);

  const centrePoint = useMemo(() => {
    let data = updatedGeojson || geojson;

    if (!data || typeof data === "string" || data?.features?.length === 0 || name?.length === 0) {
      return null;
    }

    const centre = turf.center(data as AllGeoJSON);

    if (!centre) {
      return null;
    }

    return {
      ...centre,
      properties: {
        description: name
      }
    };
  }, [geojson, name, updatedGeojson]);

  useEffect(() => {
    if (mapRef && centrePoint && showLabel) {
      // Bring label to top
      mapRef.moveLayer("label");
    }
  }, [centrePoint, mapRef, showLabel]);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (mapRef && (updatedGeojson || name)) {
      setSaving(true);
      setShowLabel(false);
      setShouldUseChangesMade(false);
      goToGeojson(mapRef, updatedGeojson || area?.attributes.geostore.geojson, false);
      const method = mode === "manage" ? "PATCH" : "POST";

      let id = area?.id || "";

      try {
        if (updatedGeojson) {
          const resp = await saveAreaWithGeostore(
            {
              ...area,
              geojson: updatedGeojson,
              name
            },
            mapRef.getCanvas(),
            method
          );
          // @ts-ignore - Incorrect type
          id = Object.keys(resp.area)[0];
        } else {
          await saveArea({ ...area, name }, mapRef.getCanvas(), method);
        }

        history.push(`/areas/${id}`);
        toastr.success(intl.formatMessage({ id: "areas.saved" }), "");
        ReactGA.event({
          category: CATEGORY.AREA_CREATION,
          action: ACTION.AREA_SAVE,
          label: "Area creation success"
        });
      } catch (err) {
        toastr.error(intl.formatMessage({ id: "areas.errorSaving" }), "");
        setShouldUseChangesMade(true);
      }

      setShowLabel(true);
    }
  };

  const handleMapEdit = (e: FeatureCollection) => {
    if (JSON.stringify(e) !== JSON.stringify(geojson)) {
      setUpdatedGeojson(e);
    } else {
      setUpdatedGeojson(null);
    }
  };

  const handleResetForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset();
    if (area?.attributes?.name) {
      setValue("name", area.attributes.name);
    }
    drawRef?.deleteAll();
    if (geojson) {
      drawRef?.add(geojson);
      goToGeojson(mapRef, geojson, false);
    }
    handleMapEdit(geojson);
  };

  const handleShapefileSuccess = (e: FeatureCollection) => {
    if (drawRef) {
      drawRef.add(e);
      const featureCollection = drawRef.getAll();
      handleMapEdit(featureCollection);
      goToGeojson(mapRef, featureCollection);
    }
  };

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  const handleDrawLoad = (e: MapboxDraw) => {
    setDrawRef(e);
  };

  const onShapefileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    ReactGA.event({
      category: CATEGORY.AREA_CREATION,
      action: ACTION.UPLOAD_SHAPEFILE,
      label: "Upload shapefile button clicked"
    });
    setIsValidatingShapefile(true);

    const shapeFile = e.target.files && e.target.files[0];
    const maxFileSize = 1000000; //1MB

    if (shapeFile && shapeFile.size <= maxFileSize) {
      const geojson = await getGeoFromShape(shapeFile);
      if (geojson && geojson.features) {
        const geojsonParsed = geojson.features.reduce(union);

        if (geojsonParsed) {
          handleShapefileSuccess(geojsonParsed);
          ReactGA.event({
            category: CATEGORY.AREA_CREATION,
            action: ACTION.UPLOAD_SHAPEFILE,
            label: "Shapefile upload success"
          });
        }
      }
    } else {
      toastr.error(
        intl.formatMessage({ id: "areas.fileTooLarge" }),
        intl.formatMessage({ id: "areas.fileTooLargeDesc" })
      );
      ReactGA.event({
        category: CATEGORY.AREA_CREATION,
        action: ACTION.UPLOAD_SHAPEFILE,
        label: "Shapefile upload failed - File too large"
      });
    }
    e.target.value = ""; // Reset input
    setIsValidatingShapefile(false);
  };

  return (
    <>
      <div className="c-area-edit l-full-page-map">
        <Loader isLoading={loading || saving} />

        <Hero
          title={areaTitleKeys[mode as keyof typeof areaTitleKeys]}
          backLink={{ name: "areas.back", to: "/areas" }}
          actions={
            mode === "manage" ? (
              <Link className="c-button c-button--secondary-light-text" to={`${url}/delete`}>
                <FormattedMessage id="areas.deleteArea" />
              </Link>
            ) : undefined
          }
        />

        <Map
          // className="c-map--within-hero"
          onMapLoad={handleMapLoad}
          onDrawLoad={handleDrawLoad}
          onMapEdit={handleMapEdit}
          geojsonToEdit={geojson}
        >
          {centrePoint && showLabel && (
            <Source id="label" type="geojson" data={centrePoint}>
              {/* @ts-ignore */}
              <Layer {...labelStyle} id="label" />
            </Source>
          )}
        </Map>

        <div className="row column u-w-100">
          <div className="c-area-edit__actions">
            <div className="c-area-edit__shapefile">
              <label className="c-button c-button--default" htmlFor="shapefile">
                <FormattedMessage id={isValidatingShapefile ? "common.loading" : "areas.uploadShapefile"} />
              </label>
              <input
                type="file"
                id="shapefile"
                name="shapefile"
                className="u-visually-hidden"
                accept=".zip, .csv, .json, .geojson, .kml, .kmz"
                onChange={onShapefileChange}
                disabled={isValidatingShapefile || !drawRef}
              />
              <Button
                variant="primary"
                isIcon
                aria-label={intl.formatMessage({ id: "areas.uploadShapefileHelp" })}
                onClick={() => {
                  setShowShapeFileHelpModal(true);
                }}
              >
                <img src={InfoIcon} alt="" role="presentation" />
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="c-area-edit__form">
              <Input
                id="area-name"
                registered={register("name", { required: true })}
                error={formState.errors.name}
                htmlInputProps={{
                  type: "text",
                  placeholder: intl.formatMessage({ id: "areas.nameAreaPlaceholder" }),
                  label: intl.formatMessage({ id: "areas.nameArea" }),
                  onChange: () => {}
                }}
              />
              <div className="c-area-edit__form-actions">
                <Button disabled={!changesMade} variant="secondary" onClick={handleResetForm}>
                  <FormattedMessage id="common.cancel" />
                </Button>
                <input disabled={!(changesMade && changesValid)} type="submit" className="c-button c-button--primary" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showShapeFileHelpModal}
        onClose={() => {
          setShowShapeFileHelpModal(false);
        }}
        title="areas.shapefileInfoTitle"
        actions={[
          {
            name: "common.ok",
            onClick: () => {
              setShowShapeFileHelpModal(false);
            }
          }
        ]}
      >
        <p className="c-modal-dialog__text">
          <FormattedMessage id="areas.shapefileInfoMaxSize" />
        </p>
        <p className="c-modal-dialog__text">
          <FormattedMessage id="areas.shapefileInfoFormats" />
        </p>
        <ul className="c-list c-modal-dialog__text">
          <li className="c-list__item">
            <FormattedMessage id="areas.shapefileInfoUnzippedTitle" />{" "}
            <FormattedMessage id="areas.shapefileInfoUnzipped" />
          </li>
          <li className="c-list__item">
            <FormattedMessage id="areas.shapefileInfoZippedTitle" /> <FormattedMessage id="areas.shapefileInfoZipped" />
          </li>
        </ul>
      </Modal>
      {modal}

      <Switch>
        <Route path={`${path}/delete`}>
          <DeleteArea />
        </Route>
      </Switch>
    </>
  );
};
export default AreaEdit;
