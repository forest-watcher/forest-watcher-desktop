import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CarouselThumb from "./CarouselThumb";
import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import CarouselImageDownloadModal from "./modal/CarouselImageDownloadModal";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/ui/Button/Button";
import downloadIcon from "assets/images/icons/Download.svg";

type CarouselProps = {
  slides: string[];
  downloadable?: boolean;
};

const Carousel = ({ slides, downloadable }: CarouselProps) => {
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

  if (!slides || slides.length === 0) {
    return <FormattedMessage id="common.noImages" />;
  }

  return (
    <>
      <OptionalWrapper data={!!imageToView}>
        <CarouselImageDownloadModal onClose={() => setImageToView("")} imageToDownload={imageToView} />
      </OptionalWrapper>
      <div className="c-carousel">
        <div className="c-carousel__viewport mb-4 rounded-b" ref={mainViewportRef}>
          <div className="c-carousel__container">
            {slides.map((src, index) => (
              <div className="c-carousel__slide" key={index}>
                <div className="relative h-[450px] overflow-hidden">
                  <OptionalWrapper data={downloadable}>
                    <Button
                      className="absolute top-10 right-10 z-10"
                      onClick={() => handleDownload(src)}
                      aria-label={intl.formatMessage({ id: "common.download" })}
                      isIcon
                    >
                      <Icon name="Download" size={36} />
                    </Button>
                  </OptionalWrapper>
                  <button
                    className="w-full h-full"
                    onClick={() => setImageToView(src)}
                    aria-label={intl.formatMessage({ id: "common.view" })}
                  >
                    <img className="w-full h-full object-cover" src={src} alt="" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <Button
            className="absolute -left-14 top-1/2 u-translate-y-half"
            disabled={!prevBtnEnabled}
            onClick={scrollPrev}
            isIcon
            aria-label={intl.formatMessage({ id: "common.previous" })}
          >
            <Icon name="ChevronLeft" size={36} />
          </Button>
          <div className="overflow-hidden" ref={thumbViewportRef}>
            <div className="flex gap-4">
              {slides.map((src, index) => (
                <CarouselThumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  imgSrc={src}
                  key={index}
                />
              ))}
            </div>
          </div>
          <Button
            className="absolute -right-14 top-1/2 u-translate-y-half"
            disabled={!nextBtnEnabled}
            onClick={scrollNext}
            isIcon
            aria-label={intl.formatMessage({ id: "common.next" })}
          >
            <Icon name="ChevronRight" size={36} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Carousel;
