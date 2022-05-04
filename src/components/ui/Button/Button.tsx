import { FC, ButtonHTMLAttributes } from "react";
import classnames from "classnames";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: FC<IProps> = props => {
  const { className, children, variant = "primary", ...rest } = props;
  const classes = classnames("c-button", `c-button--${variant}`, className);

  return (
    <button className={classes} data-testid="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
