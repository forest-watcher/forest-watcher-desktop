import { FC, useEffect, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { polygonStyle, polygonLineStyle, polygonLineStyleHover } from "./styles";

interface IProps {
  id: string;
  data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string | undefined;
  onClick?: (id: string) => void;
}

const Polygon: FC<IProps> = ({ id, data, onClick }) => {
  const { current: map } = useMap();
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    map?.on("mouseenter", id, e => {
      const { features } = e;
      if (features && features[0].source === id) {
        setIsHover(true);
      }
    });

    map?.on("mouseleave", id, e => {
      setIsHover(false);
    });

    map?.on("click", id, e => {
      const { features } = e;
      if (features && features[0].source === id) {
        onClick?.(id);
      }
    });
  }, [id, map, onClick]);

  const layerStyle = isHover ? polygonLineStyleHover : polygonLineStyle;

  return (
    <>
      <Source id={id} data={data} type="geojson">
        {/* @ts-ignore */}
        <Layer {...polygonStyle} id={id} />
      </Source>
      <Source id={id} data={data} type="geojson">
        {/* @ts-ignore */}
        <Layer {...layerStyle} id={`${id}-line`} />
      </Source>
    </>
  );
};

export default Polygon;
