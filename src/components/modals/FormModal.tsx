import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import Modal, { IProps as IModalProps } from "components/ui/Modal/Modal";
import { Props as IInputProps } from "components/ui/Form/Input";
import { Props as ISelectProps } from "components/ui/Form/Select";
import { IProps as IToggleGroupProps } from "components/ui/Form/ToggleGroup";
import { Props as IToggleProps } from "components/ui/Form/Toggle";
import { Props as IRadioChipGroupProps } from "components/ui/Form/RadioChipGroup";
import { useForm, SubmitHandler, RegisterOptions, UnpackNestedValue, FieldPath } from "react-hook-form";
import UnsavedChanges from "components/modals/UnsavedChanges";
import Loader from "components/ui/Loader";
import { UseFormProps } from "react-hook-form/dist/types";
import { FormattedMessage } from "react-intl";
import FormModalInput from "./FormModalInput";
import { usePrevious } from "hooks/usePrevious";

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
export type TToggle<T> = Omit<Omit<IToggleProps, "formHook">, "registered"> & IInputBase<T>;
export type TRadioGroup<T> = Omit<Omit<IRadioChipGroupProps, "formHook">, "registered"> & IInputBase<T>;
export type TAvailableTypes<T> = TInput<T> | TSelect<T> | TToggleGroup<T> | TToggle<T> | TRadioGroup<T>;

export interface IProps<T> extends PropsWithChildren {
  isOpen: boolean;
  dismissible?: boolean;
  inputs: Array<TAvailableTypes<T>>;
  onClose?: () => void;
  onSave: (data: UnpackNestedValue<T>) => Promise<void>;
  modalTitle: string;
  modalSubtitle?: string;
  submitBtnName: string;
  cancelBtnName?: string;
  useFormProps?: UseFormProps<T>;
  actions?: ReactNode;
  resetValues?: UnpackNestedValue<T>;
  watch?: string[];
  onChange?: (changes: any, values: any) => void;
  hideUnsavedChangesModal?: boolean;
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
    dismissible,
    inputs,
    useFormProps,
    onClose,
    onSave,
    modalTitle,
    submitBtnName,
    cancelBtnName = "common.cancel",
    modalSubtitle,
    actions,
    resetValues,
    hideUnsavedChangesModal
  } = props;

  const formHook = useForm<T>(useFormProps);

  const {
    handleSubmit,
    reset,
    formState: { isDirty }
  } = formHook;
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClosing(false);
    setIsLoading(false);
    reset(resetValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset]);

  const handleCloseRequest = () => {
    if (isDirty && !hideUnsavedChangesModal) {
      setIsClosing(true);
    } else if (onClose) {
      onClose();
    }
  };

  const onSubmit: SubmitHandler<T> = async data => {
    setIsLoading(true);
    await onSave(data);
    setIsLoading(false);
  };

  const modalActions: IModalProps["actions"] = [{ name: submitBtnName, onClick: handleSubmit(onSubmit) }];
  if (onClose) {
    modalActions.push({ name: cancelBtnName, variant: "secondary", onClick: handleCloseRequest });
  }

  //@ts-ignore
  const watchedValues = formHook.watch(props.watch);
  const prevWatchedValues = usePrevious(watchedValues);

  useEffect(() => {
    if (JSON.stringify(watchedValues) !== JSON.stringify(prevWatchedValues)) {
      props.onChange?.(watchedValues, formHook.getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose && handleCloseRequest}
        title={modalTitle}
        dismissible={dismissible}
        actions={modalActions}
      >
        <Loader isLoading={isLoading} />
        {modalSubtitle && (
          <p className="c-modal-dialog__text ">
            <FormattedMessage id={modalSubtitle} />
          </p>
        )}
        <form className="c-modal-form" onSubmit={handleSubmit(onSubmit)}>
          {inputs.map(item => (
            <FormModalInput<T> key={item.id} input={item} formhook={formHook} />
          ))}
          {props.children}
        </form>
        {actions && <div className="c-modal-dialog__extra-actions">{actions}</div>}
        {onClose && !hideUnsavedChangesModal && (
          <UnsavedChanges
            isOpen={isOpen && isClosing}
            leaveCallBack={onClose}
            stayCallBack={() => setIsClosing(false)}
            hideBackdrop
          />
        )}
      </Modal>
    </>
  );
};

export default FormModal;
