import { FC, HTMLAttributes } from "react";
import classnames from "classnames";

interface IProps extends HTMLAttributes<HTMLElement> {
  variant?: "primary" | "secondary";
  isSelectable?: boolean;
}

const Chip: FC<IProps> = props => {
  const { className, children, variant = "primary", isSelectable = false, ...rest } = props;
  const classes = classnames("c-chip", `c-chip--${variant}`, isSelectable && "c-chip--is-selectable", className);

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

export default Chip;
