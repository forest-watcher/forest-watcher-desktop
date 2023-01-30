import classNames from "classnames";
import Icon from "components/extensive/Icon";
import Card from "components/ui/Card/Card";
import useOnClickOutside from "hooks/useOnOutsideClick";
import { FC, HTMLAttributes, MutableRefObject, ReactNode, useRef } from "react";
import { useIntl } from "react-intl";

export type positions = "top-left" | "bottom-left" | "top-right" | "bottom-right";

interface IParams extends HTMLAttributes<HTMLElement> {
  onBack?: () => void;
  titleIconName?: string;
  title: string;
  footer?: ReactNode;
  children?: ReactNode;
  position?: positions;
  onOutsideClick?: (event: MouseEvent | TouchEvent) => void;
  mapCardContentRef?: MutableRefObject<HTMLDivElement | undefined>;
}

const MapCard: FC<IParams> = props => {
  const {
    onBack,
    title,
    titleIconName,
    footer,
    children,
    className,
    position = "top-left",
    mapCardContentRef,
    onOutsideClick = () => {}
  } = props;
  const intl = useIntl();
  const cardRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(cardRef, onOutsideClick);

  return (
    <Card className={classNames("c-map-card", `c-map-card--${position}`, className)} ref={cardRef}>
      <Card.Header className="c-map-card__header">
        {onBack && (
          <button
            className="c-map-card__back-button"
            aria-label={intl.formatMessage({ id: "common.back" })}
            onClick={() => onBack()}
          />
        )}
        {titleIconName && <Icon name={titleIconName} size={32} className="min-w-[32px]" />}
        <Card.Title className="c-map-card__title line-clamp-2 whitespace-normal">{title}</Card.Title>
      </Card.Header>
      {/* @ts-ignore ref type does not match */}
      <div className="c-map-card__content" ref={mapCardContentRef}>
        {children}
      </div>
      {footer && <Card.Footer className="c-map-card__footer">{footer}</Card.Footer>}
    </Card>
  );
};

export default MapCard;
