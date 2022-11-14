import Icon from "components/extensive/Icon";
import Card from "components/ui/Card/Card";
import { Link } from "react-router-dom";

type IconCardProps = {
  iconName: string;
  title: string;
  text: string;
  textLink?: string;
};

const IconCard = ({ iconName, title, text, textLink }: IconCardProps) => {
  const _renderText = () => {
    switch (true) {
      case !!textLink:
        return (
          <Link to={textLink ?? ""} className="text-neutral-700">
            {text}
          </Link>
        );
      default:
        return text;
    }
  };

  return (
    <Card className="max-w-none flex items-center gap-3 bg-neutral-400">
      <div className="flex justify-center items-center h-[48px] w-[48px] rounded-full bg-primary-500 p-3">
        <Icon name={iconName} className="text-neutral-300" size={22} />
      </div>

      <div className="flex min-h-[48px] flex-col justify-between">
        <p className="font-medium text-sm text-neutral-700 uppercase">{title}</p>
        <p className={`font-normal text-base text-neutral-700 line-clamp-1 ${textLink && "underline"}`}>
          {_renderText()}
        </p>
      </div>
    </Card>
  );
};

export default IconCard;
