import Icon, { IconProps } from "components/extensive/Icon";
import { FC } from "react";
import classnames from "classnames";

export interface IProps extends Omit<IconProps, "className"> {
  className?: string;
  iconClassName?: string;
}

const IconBubble: FC<IProps> = props => {
  const { className, iconClassName, ...iconProps } = props;

  return (
    <div
      className={classnames(
        className,
        "w-[48px] h-[48px] bg-primary-500 rounded-full flex flex-col items-center justify-center"
      )}
    >
      <Icon className={iconClassName} {...iconProps} />
    </div>
  );
};

export default IconBubble;
