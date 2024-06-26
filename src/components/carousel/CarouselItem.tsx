import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/ui/Button/Button";
import Toggle from "components/ui/Toggle/Toggle";
import { useState } from "react";
import { ISlide } from "components/carousel/Carousel";

interface CarouselItemProps {
  index: number;
  slide: ISlide;
  downloadable?: boolean;
  handleDownload: (src: string) => void;
  sharable?: boolean;
  handleShare: (slide: ISlide) => void;
  setImageToView: (src: string) => void;
  onVisibilityChange: (isPublic: boolean, url: string) => void;
}

const CarouselItem = ({
  index,
  slide,
  downloadable,
  handleDownload,
  sharable,
  handleShare,
  setImageToView,
  onVisibilityChange
}: CarouselItemProps) => {
  const intl = useIntl();
  const canVisibilityChange = !!slide.originalUrl;
  const [isPublic, setIsPublic] = useState(canVisibilityChange ? slide.isPublic || false : true);

  return (
    <div className="c-carousel__slide" key={index}>
      <div className="relative h-[450px] overflow-hidden">
        <div className="absolute top-10 right-10 z-10 flex gap-2.5">
          <OptionalWrapper data={sharable}>
            <Button onClick={() => handleShare(slide)} aria-label={intl.formatMessage({ id: "common.share" })} isIcon>
              <Icon name="link" size={36} />
            </Button>
          </OptionalWrapper>
          <OptionalWrapper data={downloadable}>
            <Button
              onClick={() => handleDownload(slide.url)}
              aria-label={intl.formatMessage({ id: "common.download" })}
              isIcon
            >
              <Icon name="download" size={36} />
            </Button>
          </OptionalWrapper>
        </div>
        <button
          className="w-full h-full"
          onClick={() => setImageToView(slide.url)}
          aria-label={intl.formatMessage({ id: "common.view" })}
        >
          <img className="w-full h-full object-contain" src={slide.url} alt="" />
        </button>
      </div>
      {canVisibilityChange && (
        <>
          <hr />
          <div className="c-carousel__slide__footer">
            <Toggle
              label={intl.formatMessage({ id: "common.visibilityStatus.title" })}
              value={isPublic}
              disabled={!slide.originalUrl}
              onChange={e => {
                setIsPublic(e);
                !!slide.originalUrl && onVisibilityChange(e, slide.originalUrl);
              }}
            />
            <p className="text">
              <FormattedMessage id="common.visibilityStatus.description" />
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CarouselItem;
