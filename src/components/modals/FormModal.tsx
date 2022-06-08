import { useEffect, useState } from "react";
import { RegisterOptions, UnpackNestedValue } from "react-hook-form";
import Modal from "components/ui/Modal/Modal";
import Input, { Props as IInputProps } from "components/ui/Form/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import UnsavedChanges from "components/modals/UnsavedChanges";
import Loader from "components/ui/Loader";

type TInput<T> = Omit<IInputProps, "registered"> & {
  formatErrors: (error: any) => any; // ToDo
  registerProps: {
    // ToDo: name of Input? type 'path' in react-hook-form
    name: string;
    options: RegisterOptions<T>;
  };
};

interface IProps<T> {
  isOpen: boolean;
  inputs: TInput<T>[]; // ToDo
  onClose: () => void;
  onSave: (data: UnpackNestedValue<T>) => Promise<void>;
  modalTitle: string;
  submitBtnName: string;
  cancelBtnName?: string;
}

const FormModal = <T,>(props: IProps<T>) => {
  const { isOpen = false, inputs, onClose, onSave, modalTitle, submitBtnName, cancelBtnName = "common.cancel" } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<T>();
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
          {
            name: submitBtnName,
            onClick: handleSubmit(onSubmit)
          },
          { name: cancelBtnName, variant: "secondary", onClick: handleCloseRequest }
        ]}
      >
        <Loader isLoading={isLoading} />
        <form className="c-modal-form" onSubmit={handleSubmit(onSubmit)}>
          {inputs.map(({ formatErrors, registerProps, ...rest }) => (
            <Input
              {...rest}
              error={formatErrors(errors)}
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
