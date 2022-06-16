import { FC, HTMLAttributes } from "react";
import classnames from "classnames";

interface IProps extends HTMLAttributes<HTMLElement> {
  variant?: "primary" | "secondary" | "secondary-light-text";
  isSelectable?: boolean;
  isSelected?: boolean;
}

const Chip: FC<IProps> = props => {
  const { className, children, variant = "primary", isSelectable = false, isSelected = false, ...rest } = props;
  const classes = classnames(
    "c-chip",
    `c-chip--${variant}`,
    isSelectable && "c-chip--is-selectable",
    isSelected && "c-chip--is-selected",
    className
  );

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

export default Chip;
