import { FC, ButtonHTMLAttributes } from "react";
import classnames from "classnames";

export type IButtonVariants = "primary" | "secondary" | "secondary-light-text" | "default";

export interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IButtonVariants;
  isIcon?: Boolean;
}

const Button: FC<IProps> = props => {
  const { className, children, variant = "primary", isIcon = false, ...rest } = props;
  const classes = classnames("c-button", `c-button--${variant}`, isIcon && "c-button--is-icon", className);

  return (
    <button className={classes} data-testid="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
