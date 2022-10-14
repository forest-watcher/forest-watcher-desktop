import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CarouselThumb from "./CarouselThumb";

type CarouselProps = {
  slides: string[];
};

const Carousel = ({ slides }: CarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  if (!slides || slides.length == 0) {
    return <p>No Images</p>;
  }

  return (
    <>
      <div className="carousel pb-[25px]">
        <div className="carousel__viewport" ref={mainViewportRef}>
          <div className="carousel__container">
            {slides.map((src, index) => (
              <div className="carousel__slide" key={index}>
                <div className="carousel__slide__inner">
                  <img className="carousel__slide__img" src={src} alt="A cool cat." />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="carousel carousel--thumb">
        <div className="carousel__viewport" ref={thumbViewportRef}>
          <div className="carousel__container carousel__container--thumb">
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
      </div>
    </>
  );
};

export default Carousel;
