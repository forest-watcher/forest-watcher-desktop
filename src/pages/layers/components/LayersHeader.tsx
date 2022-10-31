import { useMemo } from "react";
import Hero from "components/layouts/Hero/Hero";
import Button from "components/ui/Button/Button";
import { FormattedMessage } from "react-intl";

type LayersHeaderProps = {
  onEdit?: () => void;
  canEdit?: boolean;
};

const LayersHeader = ({ onEdit, canEdit }: LayersHeaderProps) => {
  const editButton = useMemo(() => {
    if (!canEdit) return <></>;
    return (
      <Button onClick={onEdit}>
        <FormattedMessage id="common.edit" />
      </Button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit]);

  return <Hero title={"settings.layers"} actions={onEdit && canEdit ? editButton : <></>}></Hero>;
};

export default LayersHeader;
