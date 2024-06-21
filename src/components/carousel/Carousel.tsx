import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CarouselThumb from "./CarouselThumb";
import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import CarouselImageDownloadModal from "./modal/CarouselImageDownloadModal";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/ui/Button/Button";
import CarouselItem from "components/carousel/CarouselItem";
import { copyToClipboard } from "helpers/exports";
import { toastr } from "react-redux-toastr";

export type ISlide = {
  url: string;
  originalUrl?: string;
  isPublic?: boolean;
};

type CarouselProps = {
  slides: ISlide[];
  downloadable?: boolean;
  sharable?: boolean;
  onVisibilityChange: (isPublic: boolean, src: string) => void;
};

const Carousel = ({ slides, downloadable, sharable, onVisibilityChange }: CarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [imageToView, setImageToView] = useState<string>("");
  const intl = useIntl();
  const [mainViewportRef, carousel] = useEmblaCarousel({ skipSnaps: false, draggable: false });
  const [thumbViewportRef, carouselThumbs] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true
  });

  const scrollPrev = useCallback(() => carousel?.scrollPrev(), [carousel]);
  const scrollNext = useCallback(() => carousel?.scrollNext(), [carousel]);

  const onSelect = useCallback(() => {
    if (!carousel || !carouselThumbs) {
      return;
    }
    setSelectedIndex(carousel.selectedScrollSnap());
    carouselThumbs.scrollTo(carousel.selectedScrollSnap());

    setPrevBtnEnabled(carousel.canScrollPrev());
    setNextBtnEnabled(carousel.canScrollNext());
  }, [carousel, carouselThumbs, setSelectedIndex]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!carousel || !carouselThumbs) {
        return;
      }
      if (carouselThumbs.clickAllowed()) {
        carousel.scrollTo(index);
      }
    },
    [carousel, carouselThumbs]
  );

  useEffect(() => {
    if (!carousel) return;
    onSelect();
    carousel.on("select", onSelect);

    return () => {
      carousel.off("select", onSelect);
    };
  }, [carousel, onSelect]);

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const handleShare = (slide: ISlide) => {
    console.log(slide);
    if (slide.isPublic) {
      copyToClipboard(slide.originalUrl || slide.url)
        .then(() => {
          toastr.success(intl.formatMessage({ id: "common.share.toast.success" }), "");
        })
        .catch(() => {
          toastr.error(intl.formatMessage({ id: "common.error" }), "");
        });
    } else {
      toastr.error(intl.formatMessage({ id: "common.share.toast.error" }), "");
    }
  };

  if (!slides || slides.length === 0) {
    return (
      <p className="text-base">
        <FormattedMessage id="common.noImages" />
      </p>
    );
  }

  return (
    <>
      <OptionalWrapper data={!!imageToView}>
        <CarouselImageDownloadModal onClose={() => setImageToView("")} imageToDownload={imageToView} />
      </OptionalWrapper>
      <div className="c-carousel">
        <div
          className="c-carousel__viewport mb-4 rounded-b border-t-0 border-2 bg-neutral-300 border-solid border-neutral-600 border-opacity-10"
          ref={mainViewportRef}
        >
          <div className="c-carousel__container">
            {slides.map((src, index) => (
              <CarouselItem
                key={index}
                index={index}
                slide={src}
                downloadable={downloadable}
                handleDownload={handleDownload}
                sharable={sharable}
                handleShare={handleShare}
                setImageToView={setImageToView}
                onVisibilityChange={onVisibilityChange}
              />
            ))}
          </div>
        </div>
        {slides.length > 1 && (
          <div className="relative flex items-center gap-4">
            <Button
              className="xl:absolute xl:-left-14 top-1/2 xl:u-translate-y-half"
              disabled={!prevBtnEnabled}
              onClick={scrollPrev}
              isIcon
              aria-label={intl.formatMessage({ id: "common.previous" })}
            >
              <Icon name="ChevronLeft" size={36} />
            </Button>
            <div className="overflow-hidden grow" ref={thumbViewportRef}>
              <div className="flex gap-4">
                {slides.map((src, index) => (
                  <CarouselThumb
                    onClick={() => onThumbClick(index)}
                    selected={index === selectedIndex}
                    imgSrc={src.url}
                    key={index}
                  />
                ))}
              </div>
            </div>
            <Button
              className="xl:absolute xl:-right-14  xl:top-1/2 xl:u-translate-y-half"
              disabled={!nextBtnEnabled}
              onClick={scrollNext}
              isIcon
              aria-label={intl.formatMessage({ id: "common.next" })}
            >
              <Icon name="ChevronRight" size={36} />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Carousel;
