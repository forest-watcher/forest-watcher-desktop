import { FC, HTMLAttributes, useEffect } from "react";
import classnames from "classnames";
import { useMap } from "react-map-gl";
import ZoomInIcon from "assets/images/icons/Plus.svg";
import ZoomOutIcon from "assets/images/icons/Minus.svg";
import { Popover } from "@headlessui/react";
import Input from "components/ui/Form/Input";
import Select from "components/ui/Form/Select";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

interface IProps extends HTMLAttributes<HTMLElement> {
  countriesOptions?: Array<{
    label: string;
    value: string;
  }>;
  getCountries: () => void;
  countries: Array<any>;
}

const MapControls: FC<IProps> = props => {
  const { className, countriesOptions = [], getCountries, countries, ...rest } = props;
  const classes = classnames("c-map__controls", className);
  const { current: map } = useMap();
  const formHook = useForm();
  const { register, handleSubmit, watch, formState } = formHook;

  const onZoomIn = () => {
    map?.zoomIn();
  };

  const onZoomOut = () => {
    map?.zoomOut();
  };

  const onSubmit: SubmitHandler<FieldValues> = data => console.log(data);

  useEffect(() => {
    getCountries();
  }, [getCountries]);

  return (
    <div className={classes} {...rest}>
      <Popover className="c-map__search-controls">
        <Popover.Button aria-label="Search address" className="c-map__control c-map__control--search">
          <img src={ZoomInIcon} alt="" role="presentation" />
        </Popover.Button>

        <Popover.Panel className="c-map__search-panel">
          <div className="c-map__autocomplete-section">
            <label htmlFor="search-input" className="u-visually-hidden">
              Search Address
            </label>
            <input id="search-input" className="c-map__search-input" type="text" placeholder="Search Address" />
            <button aria-label="close"></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              id="country"
              formHook={formHook}
              registered={register("country")}
              selectProps={{
                placeholder: "Select A Country",
                options: countriesOptions,
                label: "Search by Country",
                alternateLabelStyle: true
              }}
            />
            <p className="c-map__search-label">Search by Latitude and longitude</p>
            <Input
              id="lat"
              registered={register("lat")}
              htmlInputProps={{
                type: "text",
                placeholder: "Enter Latitude",
                label: "Enter Latitude"
              }}
              hideLabel
              className="c-map__panel-input"
            />
            <Input
              id="lng"
              registered={register("lng")}
              htmlInputProps={{
                type: "text",
                placeholder: "Enter Longitude",
                label: "Enter Longitude"
              }}
              hideLabel
              className="c-map__panel-input"
            />
          </form>
        </Popover.Panel>
      </Popover>
      <div className="c-map__zoom-controls">
        <button className="c-map__control" onClick={onZoomIn} aria-label="Zoom in">
          <img src={ZoomInIcon} alt="" role="presentation" />
        </button>
        <button className="c-map__control" onClick={onZoomOut} aria-label="Zoom out">
          <img src={ZoomOutIcon} alt="" role="presentation" />
        </button>
      </div>
    </div>
  );
};

export default MapControls;
