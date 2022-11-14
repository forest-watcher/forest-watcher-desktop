import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { FieldError } from "components/ui/Form/FieldError";
import IconBubble from "components/ui/Icon/IconBubble";
import classnames from "classnames";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Switch } from "@headlessui/react";
import { Control, Path, useController, UseControllerProps, useWatch } from "react-hook-form";

type TMultiSelectDialogGroups = {
  options: { value: string; label: string }[];
  label?: string;
}[];

export interface IProps {
  groups: TMultiSelectDialogGroups;
}

export interface IMultiSelectDialogPreviewProps<T> {
  className?: string;
  // ToDo: Maybe UseWatcherProps<T>
  control: Control<T>;
  name: Path<T>;
  error?: any;
  groups: TMultiSelectDialogGroups;
  label: string;
  emptyLabel: string;
  emptyIcon: string;
  addButtonLabel: string;
  // If all options in a group is selected, should the group show "All"
  shouldDisplayAllLabel?: boolean;
  // Each group option will be on Separate lines, instead of comma separated
  shouldDisplayGroupOptionsOnSeparateLines?: boolean;
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
        <div key={group.label} className="flex flex-col gap-4">
          {group.label && <span className="block text-sm font-medium uppercase text-neutral-700">{group.label}</span>}

          {group.options.map((option, id) => (
            <div key={option.value || id} className="flex justify-between w-full">
              <Switch.Group>
                <Switch.Label className="cursor-pointer text-base">{option.label}</Switch.Label>
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
  const {
    className,
    label,
    emptyLabel,
    emptyIcon,
    addButtonLabel,
    groups,
    control,
    name,
    onAdd,
    shouldDisplayAllLabel = true,
    shouldDisplayGroupOptionsOnSeparateLines = false,
    error
  } = props;
  const watcher = useWatch({
    control,
    name
  });

  const activeGroups = useMemo(
    () =>
      groups.reduce<TMultiSelectDialogGroups>((acc, group) => {
        let activeGroup = {
          ...group,
          // @ts-ignore
          options: group.options.filter(option => watcher?.includes(option.value))
        };

        // If all the options in this group are selected (and there was more than one option)
        if (group.options.length > 1 && activeGroup.options.length === group.options.length && shouldDisplayAllLabel) {
          activeGroup = {
            ...activeGroup,
            options: [
              {
                value: "",
                label: "All"
              }
            ]
          };
        }

        if (activeGroup.options.length === 0) {
          return acc;
        } else {
          return [...acc, activeGroup];
        }
      }, []),
    [groups, watcher, shouldDisplayAllLabel]
  );

  const AddBtn = () => (
    <Button className="w-full bg-neutral-300 text-neutral-600" variant="secondary" onClick={onAdd}>
      <Icon size={13} name="GreenPlus" className="mr-3 my-[-1px]" />
      <FormattedMessage id={addButtonLabel} />
    </Button>
  );

  return (
    <>
      <OptionalWrapper
        data={activeGroups.length > 0}
        elseComponent={
          // Empty State
          <div
            className={classnames(
              className,
              "flex flex-col justify-center items-center rounded-md bg-neutral-400 px-4 py-6 relative"
            )}
          >
            <IconBubble className="mb-3" name={emptyIcon} size={22} />

            <h2 className="text-lg text-neutral-700 mb-6">
              <FormattedMessage id={emptyLabel} />
            </h2>

            <AddBtn />

            {error && <Icon className="c-input__error-icon" name="Error" />}
          </div>
        }
      >
        <div className={className}>
          <span className="block mb-3 text-sm font-medium uppercase text-neutral-700">
            <FormattedMessage id={label} />
          </span>

          <ul className="text-neutral-700 text-base mb-3">
            {activeGroups.map((group, groupId) => {
              return shouldDisplayGroupOptionsOnSeparateLines ? (
                group.options.map((option, optionId) => (
                  <li key={group.label || optionId}>
                    {group.label && <>{group.label}: </>}
                    {option.label}
                  </li>
                ))
              ) : (
                <li key={group.label || groupId}>
                  {group.label && <>{group.label}: </>}
                  {group.options.map(option => option.label).join(", ")}
                </li>
              );
            })}
          </ul>

          <AddBtn />
        </div>
      </OptionalWrapper>
      <FieldError error={error} id="error" />
    </>
  );
};

MultiSelectDialog.Preview = MultiSelectDialogPreview;

export default MultiSelectDialog;
