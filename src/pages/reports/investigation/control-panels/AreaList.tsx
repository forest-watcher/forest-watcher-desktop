import { FC } from "react";
import { useAppSelector } from "hooks/useRedux";
import { RouteComponentProps } from "react-router-dom";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Card from "components/ui/Card/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Loader from "../../../../components/ui/Loader";

interface IProps extends RouteComponentProps {}

const AreaListControlPanel: FC<IProps> = props => {
  const { match } = props;
  const intl = useIntl();
  const { data: areas, loading: isLoadingAreas } = useAppSelector(state => state.areas);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "reporting.control.panel.area.list.title" })}
    >
      <Loader isLoading={isLoadingAreas} />
      <h3 className="c-map-control-panel__sub-title">
        <FormattedMessage id="reporting.control.panel.area.list.your.areas" />
      </h3>
      <div className="c-map-control-panel__grid">
        {Object.values<any>(areas).map(area => {
          const areaCreatedDate = new Date(area.attributes.createdAt);
          const day = ("0" + areaCreatedDate.getDate()).slice(-2),
            month = intl.formatMessage({ id: `common.date.month.${areaCreatedDate.getMonth()}` }),
            year = areaCreatedDate.getFullYear();

          return (
            <div key={area.id} className="c-map-control-panel__grid-item">
              <Card className="c-map-control-panel__area-card" size="small">
                <Card.Image
                  alt=""
                  src={area.attributes.image}
                  loading="lazy"
                  className="c-area-card__image c-map-control-panel__area-card-image"
                />
                <div className="c-map-control-panel__area-card-content">
                  <Card.Title className="u-margin-top-none">{area.attributes.name}</Card.Title>
                  <Card.Text className="u-margin-top-none">
                    <FormattedMessage id="reporting.control.panel.area.created.at">
                      {txt => <>{`${txt} ${day} ${month} ${year}`}</>}
                    </FormattedMessage>
                  </Card.Text>
                  <Card.Cta to={`${match.url}/${area.id}`} />
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </MapCard>
  );
};

export default AreaListControlPanel;
