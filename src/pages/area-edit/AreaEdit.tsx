import Hero from "components/layouts/Hero/Hero";
import Map from "components/ui/Map/Map";
import { FC, useState, MouseEvent, ChangeEvent, useEffect } from "react";
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
import { checkArea } from "helpers/areas";
import union from "@turf/union";
import InfoIcon from "assets/images/icons/Info.svg";
import { goToGeojson } from "helpers/map";
import Loader from "components/ui/Loader";

const areaTitleKeys = {
  manage: "areas.manageArea",
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

const AreaEdit: FC<IProps> = ({ mode, geojson, getGeoFromShape, setSaving, saveAreaWithGeostore, area, loading }) => {
  const { register, handleSubmit, watch, formState, reset, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });
  const { name } = watch();
  const [updatedGeojson, setUpdatedGeojson] = useState<FeatureCollection | null>(null);
  const [isValidatingShapefile, setIsValidatingShapefile] = useState(false);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [drawRef, setDrawRef] = useState<MapboxDraw | null>(null);

  useEffect(() => {
    if (area?.attributes?.name) {
      setValue("name", area.attributes.name);
    }
  }, [area?.attributes?.name, setValue]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (mapRef && updatedGeojson) {
      setSaving(true);
      const method = mode === "manage" ? "PATCH" : "POST";

      saveAreaWithGeostore(
        {
          geojson: updatedGeojson,
          name
        },
        mapRef.getCanvasContainer(),
        method
      );
      ReactGA.event({
        category: CATEGORY.AREA_CREATION,
        action: ACTION.AREA_SAVE,
        label: "Area creation success"
      });
    }
  };

  const changesValid =
    formState.errors.name === undefined && (updatedGeojson ? updatedGeojson.features.length > 0 : false);

  const intl = useIntl();

  const handleMapEdit = (e: FeatureCollection) => {
    setUpdatedGeojson(e);
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

        if (!checkArea(geojsonParsed)) {
          toastr.error(
            intl.formatMessage({ id: "areas.tooLarge" }),
            intl.formatMessage({ id: "areas.uploadedTooLargeDesc" })
          );
          ReactGA.event({
            category: CATEGORY.AREA_CREATION,
            action: ACTION.UPLOAD_SHAPEFILE,
            label: "Shapefile upload failed - Area too large"
          });
        } else {
          if (geojsonParsed) {
            handleShapefileSuccess(geojsonParsed);
            ReactGA.event({
              category: CATEGORY.AREA_CREATION,
              action: ACTION.UPLOAD_SHAPEFILE,
              label: "Shapefile upload success"
            });
          }
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
    <div className="c-area-edit">
      <Hero title={areaTitleKeys[mode as keyof typeof areaTitleKeys]} backLink={{ name: "areas.back", to: "/areas" }} />

      {loading ? (
        <div className="c-map c-map--within-hero">
          <Loader isLoading />
        </div>
      ) : (
        <Map
          className="c-map--within-hero"
          onMapLoad={handleMapLoad}
          onDrawLoad={handleDrawLoad}
          onMapEdit={handleMapEdit}
          geojsonToEdit={geojson}
        />
      )}

      <div className="row column">
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
            <Button variant="primary" isIcon aria-label={intl.formatMessage({ id: "areas.uploadShapefileHelp" })}>
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
              <Button disabled={!changesValid} variant="secondary" onClick={handleResetForm}>
                <FormattedMessage id="common.cancel" />
              </Button>
              <input disabled={!changesValid} type="submit" className="c-button c-button--primary" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AreaEdit;
