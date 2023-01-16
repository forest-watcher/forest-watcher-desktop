import Button from "components/ui/Button/Button";
import MultiSelectDialog, { TMultiSelectDialogGroups } from "components/ui/Form/Select/MultiSelectDialog";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { FC, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { TAlertsById } from "types/map";
import Icon from "components/extensive/Icon";

export interface IProps {
  selectedAlerts?: string[] | null;
  handleSelectedPointsConfirm: (id: string[]) => void;
  alertsById: TAlertsById[];
}

const AlertSelectionCard: FC<IProps> = props => {
  const { selectedAlerts, handleSelectedPointsConfirm, alertsById } = props;
  const intl = useIntl();
  const { control, setValue } = useFormContext();
  const { overlappedSelect } = useWatch({ control });

  const alertGroup = useMemo<TMultiSelectDialogGroups>(() => {
    const filtered = alertsById.filter(alert => selectedAlerts?.includes(alert.id));
    const mapped =
      filtered?.map(alert => ({
        label: intl.formatMessage({ id: `alerts.${alert.data.alertType}` }),
        value: alert.id
      })) || [];

    return [{ options: mapped }];
  }, [alertsById, intl, selectedAlerts]);

  return (
    <MapCard
      title={intl.formatMessage({ id: "alerts.deforestation.multiple" })}
      titleIconName="Deforestation"
      position="bottom-right"
      footer={
        <Button
          variant="secondary"
          onClick={e => {
            setValue("overlappedSelect", undefined);
            handleSelectedPointsConfirm(overlappedSelect);
          }}
          disabled={overlappedSelect?.length === 0}
        >
          <FormattedMessage id="alerts.deforestation.multiple.continue" />
        </Button>
      }
    >
      <div className="text-neutral-700 text-base p-4 bg-neutral-400 rounded-md mb-2">
        <Icon className="align-middle mr-2" name="InfoBubble" size={20} />
        <span>{intl.formatMessage({ id: "alerts.deforestation.multiple.select" })}</span>
      </div>
      <MultiSelectDialog groups={alertGroup} control={control} name="overlappedSelect" />
    </MapCard>
  );
};

export default AlertSelectionCard;
