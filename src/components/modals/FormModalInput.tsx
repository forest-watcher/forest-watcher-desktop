import Input from "components/ui/Form/Input";
import RadioChipGroupFormWrapper from "components/ui/Form/RadioChipGroup";
import Select from "components/ui/Form/Select";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import { UseFormReturn } from "react-hook-form/dist/types";
import { TAvailableTypes, TInput, TRadioGroup, TSelect, TToggleGroup } from "./FormModal";

export interface IProps<T> {
  input: TAvailableTypes<T>;
  formhook: UseFormReturn<T, any>;
}

const FormModalInput = <T,>(props: IProps<T>) => {
  const { input, formhook } = props;

  const {
    register,
    formState: { errors }
  } = formhook;

  if ((input as TInput<T>).htmlInputProps !== undefined) {
    const inputProps = input as TInput<T>;
    const { formatErrors, registerProps, ...rest } = inputProps;

    return (
      <Input
        {...rest}
        error={formatErrors && formatErrors(errors)}
        registered={register(registerProps.name, registerProps.options)}
      />
    );
  }

  if ((input as TSelect<T>).selectProps !== undefined) {
    const inputProps = input as TSelect<T>;
    const { formatErrors, registerProps, ...rest } = inputProps;

    return (
      <Select
        {...rest}
        error={formatErrors && formatErrors(errors)}
        registered={register(registerProps.name, registerProps.options)}
        formHook={formhook}
      />
    );
  }

  if ((input as TToggleGroup<T>).toggleGroupProps !== undefined) {
    const inputProps = input as TToggleGroup<T>;
    const { formatErrors, registerProps, ...rest } = inputProps;

    return (
      <ToggleGroup
        {...rest}
        error={formatErrors && formatErrors(errors)}
        registered={register(registerProps.name, registerProps.options)}
        formHook={formhook}
      />
    );
  }

  if ((input as TRadioGroup<T>).radioGroupProps !== undefined) {
    const inputProps = input as TRadioGroup<T>;
    const { formatErrors, registerProps, ...rest } = inputProps;

    return (
      <RadioChipGroupFormWrapper
        {...rest}
        error={formatErrors && formatErrors(errors)}
        registered={register(registerProps.name, registerProps.options)}
        formHook={formhook}
      />
    );
  }

  return <></>;
};

export default FormModalInput;
