import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import IconBubble from "components/ui/Icon/IconBubble";
import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Path, PathValue, UnpackNestedValue, useController, UseControllerProps } from "react-hook-form";

export interface IProps {}

export interface IMultiSelectDialogPreviewProps {
  label: string;
  emptyLabel: string;
  emptyIcon: string;
  addButtonLabel: string;
}

interface IMultiSelectDialogComposition {
  Preview: typeof MultiSelectDialogPreview;
}

const MultiSelectDialog: FC<IProps> & IMultiSelectDialogComposition = props => {
  const {} = props;

  return <div></div>;
};

const MultiSelectDialogPreview = <T,>(props: IMultiSelectDialogPreviewProps & UseControllerProps<T>) => {
  const { label, emptyLabel, emptyIcon, addButtonLabel, ...controlProps } = props;
  const { field } = useController(controlProps);

  return (
    <OptionalWrapper
      // @ts-ignore
      data={field.value && field.value.length > 0}
      elseComponent={
        // Empty State
        <div className="flex flex-col justify-center items-center rounded-md bg-gray-400 px-4 py-6">
          <IconBubble className="mb-3" name={emptyIcon} size={22} />

          <h2 className="text-lg text-gray-700 mb-6">
            <FormattedMessage id={emptyLabel} />
          </h2>

          <Button className="w-full" variant="secondary">
            <Icon name="PlusForButton" className="pr-[6px]" />
            <FormattedMessage id={addButtonLabel} />
          </Button>
        </div>
      }
    >
      <div>
        <span className="block mb-3 text-[14px] font-medium uppercase text-gray-700">
          <FormattedMessage id={label} />
        </span>

        <ul className="text-gray-700 font-base mb-3">
          {/*@ts-ignore*/}
          {field.value?.map(value => (
            <li>{value}</li>
          ))}
        </ul>

        <Button className="w-full" variant="secondary">
          <Icon name="PlusForButton" className="pr-[6px]" />
          <FormattedMessage id={addButtonLabel} />
        </Button>
      </div>
    </OptionalWrapper>
  );
};

MultiSelectDialog.Preview = MultiSelectDialogPreview;

export default MultiSelectDialog;
