import classNames from "classnames";
import Icon from "components/extensive/Icon";
import Card from "components/ui/Card/Card";
import { FC, HTMLAttributes, ReactNode } from "react";
import { useIntl } from "react-intl";

export type positions = "top-left" | "bottom-left" | "top-right" | "bottom-right";

interface IParams extends HTMLAttributes<HTMLElement> {
  onBack?: () => void;
  titleIconName?: string;
  title: string;
  footer?: ReactNode;
  children?: ReactNode;
  position?: positions;
}

const MapCard: FC<IParams> = props => {
  const { onBack, title, titleIconName, footer, children, className, position = "top-left" } = props;
  const intl = useIntl();
  return (
    <Card className={classNames("c-map-card", `c-map-card--${position}`, className)}>
      <Card.Header className="c-map-card__header">
        {onBack && (
          <button
            className="c-map-card__back-button"
            aria-label={intl.formatMessage({ id: "common.back" })}
            onClick={() => onBack()}
          />
        )}
        {titleIconName && <Icon name={titleIconName} size={32} />}
        <Card.Title className="c-map-card__title">{title}</Card.Title>
      </Card.Header>
      <div className="c-map-card__content">{children}</div>
      {footer && <Card.Footer className="c-map-card__footer">{footer}</Card.Footer>}
    </Card>
  );
};

export default MapCard;
