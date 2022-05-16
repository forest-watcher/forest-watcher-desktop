import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import ZoomInIcon from "assets/images/icons/Plus.svg";
import ZoomOutIcon from "assets/images/icons/Minus.svg";
import SearchIcon from "assets/images/icons/Search.svg";
import CloseIcon from "assets/images/icons/Close.svg";

import { Popover } from "@headlessui/react";
import Input from "components/ui/Form/Input";
import Select from "components/ui/Form/Select";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps extends HTMLAttributes<HTMLElement> {
  countriesOptions?: Array<{
    label: string;
    value: string;
  }>;
  getCountries: () => void;
  countries: Array<any>;
}

const schema = yup
  .object()
  .shape({
    lat: yup.number().max(90).min(-90).required(),
    lng: yup.number().max(180).min(-180).required()
  })
  .required();

const MapControls: FC<IProps> = props => {
  const { className, countriesOptions = [], getCountries, countries, ...rest } = props;
  const classes = classnames("c-map__controls", className);
  const [panelOpen, setPanelOpen] = useState(false);
  const { current: map } = useMap();
  const formHook = useForm({
    resolver: yupResolver(schema)
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = formHook;
  const selectedCountry = watch("country");
  const intl = useIntl();

  const geocoder = useMemo(() => {
    if (map) {
      return new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string,
        marker: false
      });
    }

    return null;
  }, [map]);

  const geocoderInputContainer = useRef(null);

  const onZoomIn = () => {
    map?.zoomIn();
  };

  const onZoomOut = () => {
    map?.zoomOut();
  };

  const handleGeocoderRef = (resp: any) => {
    if (resp && geocoder && !geocoderInputContainer.current) {
      geocoderInputContainer.current = resp;
      // @ts-ignore
      resp.appendChild(geocoder.onAdd(map));
      const el = resp.getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0];
      el.className = "c-map__search-input";
      el.placeholder = intl.formatMessage({ id: "components.map.searchAddress" });
      el.id = "search-input";
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = ({ lat, lng }) => {
    map?.flyTo({
      center: [lng, lat],
      zoom: 9
    });
  };

  useEffect(() => {
    getCountries();
  }, [getCountries]);

  useEffect(() => {
    if (map && selectedCountry) {
      const activeCountryBounds = countries.find(country => country.iso === selectedCountry)?.bbox;

      if (activeCountryBounds) {
        const bbox = turf.bbox(JSON.parse(activeCountryBounds));
        map.fitBounds(bbox as LngLatBoundsLike);
      }
    }
  }, [countries, map, selectedCountry]);

  return (
    <div className={classes} {...rest}>
      <Popover className="c-map__search-controls">
        <Popover.Button
          aria-label={intl.formatMessage({ id: "components.map.searchAddress" })}
          className="c-map__control c-map__control--single"
          onClick={() => setPanelOpen(true)}
        >
          <img src={SearchIcon} alt="" role="presentation" />
        </Popover.Button>

        <Popover.Panel static={panelOpen} className="c-map__search-panel">
          {({ close }) => (
            <>
              <div className="c-map__autocomplete-section">
                <label htmlFor="search-input" className="u-visually-hidden">
                  <FormattedMessage id="components.map.searchAddress" />
                </label>
                {geocoder && <div className="c-map__geocoder" ref={handleGeocoderRef}></div>}
                <button
                  aria-label="close"
                  className="c-map__control c-map__control--single c-map__control--no-shadow"
                  onClick={() => {
                    geocoderInputContainer.current = null;
                    reset();
                    setPanelOpen(false);
                    close();
                  }}
                >
                  <img src={CloseIcon} alt="" role="presentation" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Select
                  id="country"
                  formHook={formHook}
                  registered={register("country")}
                  selectProps={{
                    placeholder: intl.formatMessage({ id: "components.map.selectACountry" }),
                    options: countriesOptions,
                    label: intl.formatMessage({ id: "components.map.searchACountry" }),
                    alternateLabelStyle: true
                  }}
                />
                <p className="c-map__search-label">
                  <FormattedMessage id="components.map.searchBy" />
                </p>
                <Input
                  id="lat"
                  registered={register("lat")}
                  htmlInputProps={{
                    type: "text",
                    placeholder: intl.formatMessage({ id: "components.map.enterLat" }),
                    label: intl.formatMessage({ id: "components.map.enterLat" }),
                    inputMode: "decimal"
                  }}
                  hideLabel
                  className="c-map__panel-input"
                  error={errors.lat}
                />
                <Input
                  id="lng"
                  registered={register("lng")}
                  htmlInputProps={{
                    type: "text",
                    placeholder: intl.formatMessage({ id: "components.map.enterLng" }),
                    label: intl.formatMessage({ id: "components.map.enterLng" }),
                    inputMode: "decimal"
                  }}
                  hideLabel
                  className="c-map__panel-input"
                  error={errors.lng}
                />
                <input type="submit" className="u-visually-hidden" />
              </form>
            </>
          )}
        </Popover.Panel>
      </Popover>
      <div className="c-map__zoom-controls">
        <button
          className="c-map__control"
          onClick={onZoomIn}
          aria-label={intl.formatMessage({ id: "components.map.zoomIn" })}
        >
          <img src={ZoomInIcon} alt="" role="presentation" />
        </button>
        <button
          className="c-map__control"
          onClick={onZoomOut}
          aria-label={intl.formatMessage({ id: "components.map.zoomOut" })}
        >
          <img src={ZoomOutIcon} alt="" role="presentation" />
        </button>
      </div>
    </div>
  );
};

export default MapControls;
