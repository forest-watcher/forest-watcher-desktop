import classNames from "classnames";
import Card from "components/ui/Card/Card";
import { FC, HTMLAttributes, ReactNode } from "react";

interface IParams extends HTMLAttributes<HTMLElement> {
  onBack?: () => void;
  title: string;
  footer?: ReactNode;
  children?: ReactNode;
  position?: "top-left" | "bottom-left" | "top-right" | "bottom-right";
}

const MapCard: FC<IParams> = ({ onBack, title, footer, children, className, position = "top-left" }) => {
  return (
    <Card className={classNames("c-map-card", `c-map-card--${position}`, className)}>
      <Card.Header className="c-map-card__header">
        {onBack && <button className="c-map-card__back-button" area-label="back" onClick={() => onBack()} />}
        <Card.Title className="c-map-card__title">{title}</Card.Title>
      </Card.Header>
      <div className="c-map-card__content">{children}</div>
      {footer && <Card.Footer className="c-map-card__footer">{footer}</Card.Footer>}
    </Card>
  );
};

export default MapCard;
