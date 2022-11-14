import OptionalWrapper from "components/extensive/OptionalWrapper";

type CarouselThumbProps = {
  selected: boolean;
  onClick: () => void;
  imgSrc: string;
};

const CarouselThumb = ({ selected, onClick, imgSrc }: CarouselThumbProps) => {
  return (
    <div className="c-carousel__slide c-carousel__slide--thumb">
      <button onClick={onClick} className="c-carousel__slide__inner c-carousel__slide__inner--thumb" type="button">
        <OptionalWrapper data={selected}>
          <div className="absolute top-0 left-0 w-full h-full bg-primary-500 border-2 border-solid border-primary-600 bg-opacity-70 z-10" />
        </OptionalWrapper>
        <img className="c-carousel__slide__thumbnail" src={imgSrc} alt={imgSrc} />
      </button>
    </div>
  );
};

export default CarouselThumb;
