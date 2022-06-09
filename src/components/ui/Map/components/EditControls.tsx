import { FC, HTMLAttributes, useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import DrawIcon from "assets/images/icons/DrawPolygon.svg";
import EditIcon from "assets/images/icons/EditPolygon.svg";
import DeleteIcon from "assets/images/icons/Delete.svg";
import { FormattedMessage } from "react-intl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapInstance } from "mapbox-gl";
import { FeatureCollection } from "geojson";

interface IProps extends HTMLAttributes<HTMLElement> {
  draw: MapboxDraw;
  map: MapInstance;
  onUpdate?: (ev: FeatureCollection) => void;
}

const MapEditControls: FC<IProps> = props => {
  const { className, draw, map, onUpdate, ...rest } = props;
  const classes = classnames("c-map__controls c-map__controls--edit", className);

  const [canEdit, setCanEdit] = useState(true);
  const [canDraw, setCanDraw] = useState(true);
  const [canDelete, setCanDelete] = useState(false);

  const onEditUpdate = useCallback(() => {
    onUpdate?.(draw.getAll());
  }, [draw, onUpdate]);

  const handleDraw = () => {
    // @ts-ignore
    draw.changeMode(draw.modes.DRAW_POLYGON);
    setCanEdit(false);
  };

  const handleEdit = () => {
    const ids = draw
      .getAll()
      .features.map(feature => feature.id)
      .filter(el => el !== undefined);

    if (ids && ids.length > 0) {
      // @ts-ignore Incorrectly typed package.
      draw.changeMode(draw.modes.DIRECT_SELECT, { featureId: ids[0] });
      setCanEdit(false);
      setCanDraw(false);
      setCanDelete(true);
    }
  };

  const handleDelete = () => {
    const ids = draw.getSelectedIds();
    draw.delete(ids);
    setCanDelete(false);
    setCanEdit(true);
    setCanDraw(true);
    onEditUpdate();
  };

  useEffect(() => {
    // Map Events
    map.on("draw.modechange", function (e) {
      setCanEdit(true);
      setCanDraw(true);
      setCanDelete(false);
    });

    map.on("draw.selectionchange", function (e) {
      const isSelected = e.features.length > 0;
      setCanEdit(!isSelected);
      setCanDraw(!isSelected);
      setCanDelete(isSelected);
      if (isSelected && draw.getMode() === "simple_select") {
        // Go straight into direct select
        // @ts-ignore Incorrectly typed package.
        draw.changeMode(draw.modes.DIRECT_SELECT, { featureId: e.features[0].id });
      }
    });

    map.on("draw.update", onEditUpdate);
    map.on("draw.create", onEditUpdate);
  }, [draw, map, onEditUpdate]);

  return (
    <div className={classes} {...rest}>
      <button className="c-map__control c-map__control--single" disabled={!canDraw} onClick={handleDraw}>
        <img src={DrawIcon} alt="" role="presentation" />
        <span className="c-map__control-label">
          <FormattedMessage id="components.map.draw" />
        </span>
      </button>
      <button className="c-map__control c-map__control--single" disabled={!canEdit} onClick={handleEdit}>
        <img src={EditIcon} alt="" role="presentation" />
        <span className="c-map__control-label">
          <FormattedMessage id="components.map.edit" />
        </span>
      </button>
      <button className="c-map__control c-map__control--single" disabled={!canDelete} onClick={handleDelete}>
        <img src={DeleteIcon} alt="" role="presentation" />
        <span className="c-map__control-label">
          <FormattedMessage id="components.map.delete" />
        </span>
      </button>
    </div>
  );
};

export default MapEditControls;
