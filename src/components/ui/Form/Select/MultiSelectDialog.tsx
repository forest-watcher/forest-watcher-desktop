import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import IconBubble from "components/ui/Icon/IconBubble";
import classnames from "classnames";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Switch } from "@headlessui/react";
import { Control, Path, useController, UseControllerProps, useWatch } from "react-hook-form";

type TMultiSelectDialogGroups = {
  options: { value: string; label: string }[];
  label: string;
}[];

export interface IProps {
  groups: TMultiSelectDialogGroups;
}

export interface IMultiSelectDialogPreviewProps<T> {
  className?: string;
  // Maybe UseWatcherProps<T>
  control: Control<T>;
  name: Path<T>;
  groups: TMultiSelectDialogGroups;
  label: string;
  emptyLabel: string;
  emptyIcon: string;
  addButtonLabel: string;
  onAdd?: () => void;
}

interface IMultiSelectDialogComposition {
  Preview: typeof MultiSelectDialogPreview;
}

const MultiSelectDialog: (<T>(props: IProps & UseControllerProps<T>) => JSX.Element) &
  IMultiSelectDialogComposition = props => {
  const { groups, ...controlProps } = props;
  const { field } = useController(controlProps);
  const [controlledValue, setControlledValue] = useState(field.value || []);

  const handleChange = (checked: boolean, value: string) => {
    let copyControlledValue;
    if (checked) {
      // @ts-ignore
      copyControlledValue = [...controlledValue, value];
    } else {
      // @ts-ignore
      copyControlledValue = controlledValue.filter(i => i !== value);
    }

    // Send data to react hook form
    field.onChange(copyControlledValue);

    setControlledValue(copyControlledValue);
  };

  return (
    <div className="flex flex-col gap-10">
      {groups.map(group => (
        <div key={group.label}>
          <span className="block text-[14px] font-medium uppercase text-gray-700">
            <FormattedMessage id={group.label} />
          </span>

          {group.options.map(option => (
            <div className="flex justify-between w-full mt-4">
              <Switch.Group>
                <Switch.Label className="cursor-pointer text-base">
                  <FormattedMessage id={option.label} />
                </Switch.Label>
                <Switch
                  // @ts-ignore
                  checked={controlledValue.includes(option.value)}
                  onChange={checked => handleChange(checked, option.value)}
                >
                  {({ checked }) => (checked ? <Icon name="RadioOn" /> : <Icon name="RadioOff" />)}
                </Switch>
              </Switch.Group>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MultiSelectDialogPreview = <T,>(props: IMultiSelectDialogPreviewProps<T>) => {
  const { className, label, emptyLabel, emptyIcon, addButtonLabel, groups, control, name, onAdd } = props;
  const intl = useIntl();
  const watcher = useWatch({
    control,
    name
  });

  const activeGroups = useMemo(
    () =>
      groups.reduce<TMultiSelectDialogGroups>((acc, group) => {
        const activeGroup = {
          ...group,
          // @ts-ignore
          options: group.options.filter(option => watcher?.includes(option.value))
        };

        if (activeGroup.options.length === 0) {
          return acc;
        } else {
          return [...acc, activeGroup];
        }
      }, []),
    [groups, watcher]
  );

  return (
    <OptionalWrapper
      data={activeGroups.length > 0}
      elseComponent={
        // Empty State
        <div
          className={classnames(
            className,
            "flex flex-col justify-center items-center rounded-md bg-gray-400 px-4 py-6"
          )}
        >
          <IconBubble className="mb-3" name={emptyIcon} size={22} />

          <h2 className="text-lg text-gray-700 mb-6">
            <FormattedMessage id={emptyLabel} />
          </h2>

          <Button className="w-full" variant="secondary" onClick={onAdd}>
            <Icon name="PlusForButton" className="pr-[6px]" />
            <FormattedMessage id={addButtonLabel} />
          </Button>
        </div>
      }
    >
      <div className={className}>
        <span className="block mb-3 text-[14px] font-medium uppercase text-gray-700">
          <FormattedMessage id={label} />
        </span>

        <ul className="text-gray-700 text-base mb-3">
          {activeGroups.map(group => (
            <li key={group.label}>
              <FormattedMessage id={group.label}>
                {txt => (
                  <>{`${txt}: ${group.options.map(option => intl.formatMessage({ id: option.label })).join(", ")}`}</>
                )}
              </FormattedMessage>
            </li>
          ))}
        </ul>

        <Button className="w-full" variant="secondary" onClick={onAdd}>
          <Icon name="PlusForButton" className="pr-[6px]" />
          <FormattedMessage id={addButtonLabel} />
        </Button>
      </div>
    </OptionalWrapper>
  );
};

MultiSelectDialog.Preview = MultiSelectDialogPreview;

export default MultiSelectDialog;
