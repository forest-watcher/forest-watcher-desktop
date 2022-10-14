import Icon from "components/extensive/Icon";
import Card from "components/ui/Card/Card";

type IconCardProps = {
  iconName: string;
  title: string;
  text: string;
};

const IconCard = ({ iconName, title, text }: IconCardProps) => {
  return (
    <Card className="max-w-none flex items-center gap-3 bg-gray-400">
      <div className="flex justify-center items-center h-[48px] w-[48px] rounded-full bg-green-500 p-3">
        <Icon name={iconName} className="text-gray-300" size={22} />
      </div>

      <div className="flex min-h-[48px] flex-col justify-between">
        <p className="font-medium text-sm text-gray-700 uppercase">{title}</p>
        <p className="font-normal text-base text-gray-700">{text}</p>
      </div>
    </Card>
  );
};

export default IconCard;
