import { ReactNode, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Input, { Props as IInputProps } from "components/ui/Form/Input";
import Select, { Props as ISelectProps } from "components/ui/Form/Select";
import { useForm, SubmitHandler, RegisterOptions, UnpackNestedValue, FieldPath } from "react-hook-form";
import UnsavedChanges from "components/modals/UnsavedChanges";
import Loader from "components/ui/Loader";
import { UseFormProps } from "react-hook-form/dist/types";
import { FormattedMessage } from "react-intl";

export interface IInputBase<T> {
  formatErrors?: (error: any) => any; // ToDo
  registerProps: {
    name: FieldPath<T>;
    options: RegisterOptions<T, FieldPath<T>>;
  };
}

export type TInput<T> = Omit<IInputProps, "registered"> & IInputBase<T>;
export type TSelect<T> = Omit<Omit<ISelectProps, "formHook">, "registered"> & IInputBase<T>;

interface IProps<T> {
  isOpen: boolean;
  inputs: Array<TInput<T> | TSelect<T>>;
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

  const isInput = (item: TInput<T> | TSelect<T>) => {
    const input = item as TInput<T>;
    return input.htmlInputProps !== undefined;
  };

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
            if (isInput(item)) {
              const inputProps = item as TInput<T>;
              const { formatErrors, registerProps, ...rest } = inputProps;

              return (
                <Input
                  {...rest}
                  error={formatErrors && formatErrors(errors)}
                  registered={register(registerProps.name, registerProps.options)}
                  key={item.id}
                />
              );
            } else {
              const inputProps = item as TSelect<T>;
              const { formatErrors, registerProps, ...rest } = inputProps;

              return (
                <Select
                  {...rest}
                  error={formatErrors && formatErrors(errors)}
                  registered={register(registerProps.name, registerProps.options)}
                  formHook={formhook}
                  key={item.id}
                />
              );
            }
          })}
        </form>
        {actions && <div className="c-modal-dialog__extra-actions">{actions}</div>}
      </Modal>

      <UnsavedChanges isOpen={isOpen && isClosing} leaveCallBack={onClose} stayCallBack={() => setIsClosing(false)} />
    </>
  );
};

export default FormModal;
