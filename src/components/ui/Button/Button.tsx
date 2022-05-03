import { FC, ButtonHTMLAttributes } from "react";
import classnames from "classnames";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variation?: "primary" | "secondary";
}

const Button: FC<IProps> = props => {
  const { className, children, variation = "primary", ...rest } = props;
  const classes = classnames("c-button", `c-button--${variation}`, className);

  return (
    <button className={classes} data-testid="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
