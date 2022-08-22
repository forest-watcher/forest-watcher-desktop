import { FC, HTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";
import Card from "components/ui/Card/Card";
import EditIcon from "assets/images/icons/Edit.svg";
import { TAreasResponse } from "services/area";
import classNames from "classnames";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  area: TAreasResponse;
}

const AreaCard: FC<IProps> = ({ className, area }) => {
  return (
    <Card size="large" className={classNames("c-area-card", className)}>
      <Card.Image alt="" src={area.attributes.image} loading="lazy" className="c-area-card__image" />
      <div className="c-card__content-flex">
        <div className="u-text-ellipsis u-flex-1">
          <Card.Title className="u-margin-top-none">{area.attributes.name}</Card.Title>
        </div>
        <Card.Cta to={`/areas/${area.id}`} iconSrc={EditIcon}>
          <FormattedMessage id="common.manage" />
        </Card.Cta>
      </div>
    </Card>
  );
};
export default AreaCard;
