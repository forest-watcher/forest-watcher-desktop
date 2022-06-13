import { useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Input, { Props as IInputProps } from "components/ui/Form/Input";
import { useForm, SubmitHandler, RegisterOptions, UnpackNestedValue, FieldPath } from "react-hook-form";
import UnsavedChanges from "components/modals/UnsavedChanges";
import Loader from "components/ui/Loader";
import { UseFormProps } from "react-hook-form/dist/types";

export type TInput<T> = Omit<IInputProps, "registered"> & {
  formatErrors?: (error: any) => any; // ToDo
  registerProps: {
    name: FieldPath<T>;
    options: RegisterOptions<T, FieldPath<T>>;
  };
};

interface IProps<T> {
  isOpen: boolean;
  inputs: TInput<T>[];
  onClose: () => void;
  onSave: (data: UnpackNestedValue<T>) => Promise<void>;
  modalTitle: string;
  submitBtnName: string;
  cancelBtnName?: string;
  useFormProps?: UseFormProps<T>;
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
    cancelBtnName = "common.cancel"
  } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<T>(useFormProps);
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
        <form className="c-modal-form" onSubmit={handleSubmit(onSubmit)}>
          {inputs.map(({ formatErrors, registerProps, ...rest }) => (
            <Input
              {...rest}
              error={formatErrors && formatErrors(errors)}
              registered={register(registerProps.name, registerProps.options)}
            />
          ))}
        </form>
      </Modal>

      <UnsavedChanges isOpen={isOpen && isClosing} leaveCallBack={onClose} stayCallBack={() => setIsClosing(false)} />
    </>
  );
};

export default FormModal;
