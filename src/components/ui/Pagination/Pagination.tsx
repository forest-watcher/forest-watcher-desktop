import { FC, HTMLAttributes, useEffect, useState, MouseEvent } from "react";
import classnames from "classnames";
import Input from "components/ui/Form/Input";
import Button from "components/ui/Button/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import ChevronRight from "assets/images/icons/ChevronRight.svg";
import ChevronLeft from "assets/images/icons/ChevronLeft.svg";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number;
  onPageChange?: (v: number) => void;
}

const PAGINATION_FORM_FIELD = "pagination";

type FormValues = {
  pagination: number;
};

const Pagination: FC<IProps> = props => {
  const { className, children, max, min, onPageChange, ...rest } = props;
  const classes = classnames("c-pagination", className);
  const formhook = useForm<FormValues>();
  const { register, setValue, handleSubmit, reset } = formhook;
  const intl = useIntl();
  const [current, setCurrent] = useState<number>(min);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(current);
    }
    setValue(PAGINATION_FORM_FIELD, current);
  }, [current, onPageChange, reset, setValue]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    const value = data[PAGINATION_FORM_FIELD];

    if (!isNaN(value) && value <= max && value >= min) {
      setCurrent(value);
    } else {
      setCurrent(min);
    }
    reset();
  };

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (current < max) {
      setCurrent(v => v + 1);
    }
  };

  const handlePrveious = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (current > min) {
      setCurrent(v => v - 1);
    }
  };

  return (
    <div className={classes} {...rest}>
      <Button
        aria-label={intl.formatMessage({ id: "components.pagination.previousPage" })}
        isIcon
        onClick={handlePrveious}
        disabled={current === min}
      >
        <img src={ChevronLeft} alt="" role="presentation" />
      </Button>
      <div className="c-pagination__input-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="pagination"
            registered={register(PAGINATION_FORM_FIELD)}
            className="c-pagination__input"
            htmlInputProps={{
              type: "text",
              min: min.toString(),
              max: max.toString(),
              defaultValue: min,
              placeholder: "",
              label: "Pagination",
              hiddenLabel: true,
              inputMode: "numeric",
              pattern: "[0-9]*"
            }}
            onChange={() => {}}
          />
        </form>
        <span className="c-pagination__count">
          <FormattedMessage id="components.pagination.ofCount" values={{ value: max.toString() }} />
        </span>
      </div>
      <Button
        aria-label={intl.formatMessage({ id: "components.pagination.nextPage" })}
        isIcon
        onClick={handleNext}
        disabled={current === max}
      >
        <img src={ChevronRight} alt="" role="presentation" />
      </Button>
    </div>
  );
};

export default Pagination;
