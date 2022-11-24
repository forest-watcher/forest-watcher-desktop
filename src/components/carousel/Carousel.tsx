import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CarouselThumb from "./CarouselThumb";
import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import CarouselImageDownloadModal from "./modal/CarouselImageDownloadModal";
import { useIntl } from "react-intl";

type CarouselProps = {
  slides: string[];
  downloadable?: boolean;
};

const Carousel = ({ slides, downloadable }: CarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageToDownload, setImageToDownload] = useState<string>("");
  const intl = useIntl();
  const newSlides = [...slides, ...slides, ...slides, ...slides, ...slides, ...slides, ...slides, ...slides, ...slides];
  const [mainViewportRef, carousel] = useEmblaCarousel({ skipSnaps: false });
  const [thumbViewportRef, carouselThumbs] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!carousel || !carouselThumbs) return;
      if (carouselThumbs.clickAllowed()) carousel.scrollTo(index);
    },
    [carousel, carouselThumbs]
  );

  const onSelect = useCallback(() => {
    if (!carousel || !carouselThumbs) return;
    setSelectedIndex(carousel.selectedScrollSnap());
    carouselThumbs.scrollTo(carousel.selectedScrollSnap());
  }, [carousel, carouselThumbs, setSelectedIndex]);

  useEffect(() => {
    if (!carousel) return;
    onSelect();
    carousel.on("select", onSelect);
  }, [carousel, onSelect]);

  if (!newSlides || newSlides.length === 0) {
    return <p>No Images</p>;
  }

  return (
    <>
      <OptionalWrapper data={!!imageToDownload}>
        <CarouselImageDownloadModal onClose={() => setImageToDownload("")} imageToDownload={imageToDownload} />
      </OptionalWrapper>
      <div className="c-carousel pb-[25px]">
        <div className="c-carousel__viewport" ref={mainViewportRef}>
          <div className="c-carousel__container">
            {newSlides.map((src, index) => (
              <div className="c-carousel__slide" key={index}>
                <div className="relative h-[450px] overflow-hidden">
                  <OptionalWrapper data={downloadable}>
                    <button
                      className="absolute top-10 right-10 bg-primary-500 rounded-full z-10 w-10 h-10"
                      onClick={() => setImageToDownload(src)}
                      aria-label={intl.formatMessage({ id: "common.download" })}
                    >
                      <Icon name="download" size={36} />
                    </button>
                  </OptionalWrapper>
                  <img className="w-full h-full object-cover" src={src} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="c-carousel c-carousel--thumb">
        <div className="c-carousel__viewport" ref={thumbViewportRef}>
          <div className="c-carousel__container c-carousel__container--thumb">
            {newSlides.map((src, index) => (
              <CarouselThumb
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                imgSrc={src}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
