import { Fragment, ReactNode, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Input, { Props as IInputProps } from "components/ui/Form/Input";
import Select, { Props as ISelectProps } from "components/ui/Form/Select";
import ToggleGroup, { Props as IToggleGroupProps } from "components/ui/Form/ToggleGroup";
import { useForm, SubmitHandler, RegisterOptions, UnpackNestedValue, FieldPath } from "react-hook-form";
import UnsavedChanges from "components/modals/UnsavedChanges";
import Loader from "components/ui/Loader";
import { UseFormProps } from "react-hook-form/dist/types";
import { FormattedMessage } from "react-intl";

export interface IInputBase<T> {
  formatErrors?: (error: any) => any; // ToDo
  registerProps: {
    name: FieldPath<T>;
    options?: RegisterOptions<T, FieldPath<T>>;
  };
}

export type TInput<T> = Omit<IInputProps, "registered"> & IInputBase<T>;
export type TSelect<T> = Omit<Omit<ISelectProps, "formHook">, "registered"> & IInputBase<T>;
export type TToggleGroup<T> = Omit<Omit<IToggleGroupProps, "formHook">, "registered"> & IInputBase<T>;
export type TAvailableTypes<T> = TInput<T> | TSelect<T> | TToggleGroup<T>;

export interface IProps<T> {
  isOpen: boolean;
  inputs: Array<TAvailableTypes<T>>;
  onClose: () => void;
  onSave: (data: UnpackNestedValue<T>) => Promise<void>;
  modalTitle: string;
  modalSubtitle?: string;
  submitBtnName: string;
  cancelBtnName?: string;
  useFormProps?: UseFormProps<T>;
  actions?: ReactNode;
}

/**
 * FormModal - A reusable FormModal component
 * The Modal can be dismissed and a warning is
 * shown to the user if their data will be lost
 *
 * Example:
 *  type TFormFields = { name: string };
 *
 *  <FormModal<TFormFields>
 *     isOpen={isOpen}
 *     onClose={onClose}
 *     onSave={(data: { name: string }) => { ...Save Logic }}
 *     modalTitle="intl.string"
 *     submitBtnName="intl.string"
 *     inputs={[
 *       {
 *         id: "name-input",
 *         htmlInputProps: {
 *           SEE `components/ui/Form/Input`
 *         },
 *         registerProps: {
 *           name: "name",
 *           options: { required: true }
 *           SEE https://react-hook-form.com/api/useform/register
 *         }
 *       }
 *     ]}
 *   />
 */
const FormModal = <T,>(props: IProps<T>) => {
  const {
    isOpen = false,
    inputs,
    useFormProps,
    onClose,
    onSave,
    modalTitle,
    submitBtnName,
    cancelBtnName = "common.cancel",
    modalSubtitle,
    actions
  } = props;

  const formhook = useForm<T>(useFormProps);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = formhook;
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClosing(false);
    setIsLoading(false);
    reset();
  }, [isOpen, reset]);

  const handleCloseRequest = () => {
    if (isDirty) {
      setIsClosing(true);
    } else {
      onClose();
    }
  };

  const onSubmit: SubmitHandler<T> = async data => {
    setIsLoading(true);
    await onSave(data);
    setIsLoading(false);
  };

  const getInput = (input: TAvailableTypes<T>) => {
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

    return "";
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isClosing}
        onClose={handleCloseRequest}
        title={modalTitle}
        actions={[
          { name: submitBtnName, onClick: handleSubmit(onSubmit) },
          { name: cancelBtnName, variant: "secondary", onClick: handleCloseRequest }
        ]}
      >
        <Loader isLoading={isLoading} />
        {modalSubtitle && (
          <p className="c-modal-dialog__text ">
            <FormattedMessage id={modalSubtitle} />
          </p>
        )}
        <form className="c-modal-form" onSubmit={handleSubmit(onSubmit)}>
          {inputs.map(item => {
            return <Fragment key={item.id}>{getInput(item)}</Fragment>;
          })}
        </form>
        {actions && <div className="c-modal-dialog__extra-actions">{actions}</div>}
      </Modal>

      <UnsavedChanges isOpen={isOpen && isClosing} leaveCallBack={onClose} stayCallBack={() => setIsClosing(false)} />
    </>
  );
};

export default FormModal;
