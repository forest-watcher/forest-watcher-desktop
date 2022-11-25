import OptionalWrapper from "components/extensive/OptionalWrapper";

type CarouselThumbProps = {
  selected: boolean;
  onClick: () => void;
  imgSrc: string;
};

const CarouselThumb = ({ selected, onClick, imgSrc }: CarouselThumbProps) => {
  return (
    <button onClick={onClick} className="relative rounded overflow-hidden aspect-square w-[166.5px]" type="button">
      <OptionalWrapper data={selected}>
        <div className="absolute top-0 left-0 w-full h-full bg-primary-500 border-2 border-solid border-primary-600 bg-opacity-70 z-10" />
      </OptionalWrapper>
      <img className="w-full h-full object-cover" src={imgSrc} alt={imgSrc} />
    </button>
  );
};

export default CarouselThumb;
