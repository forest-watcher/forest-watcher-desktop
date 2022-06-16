import { FC, useMemo } from "react";
import FormModal from "components/modals/FormModal";
import { Link, useHistory, useParams } from "react-router-dom";
import { TParams } from "../AreaView";
import { FormattedMessage, useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { UnpackNestedValue } from "react-hook-form";
import { Option } from "types";
import { areaService } from "services/area";
import { useAppDispatch } from "hooks/useRedux";
import { getAreas } from "modules/areas";
import { TGetUserTeamsResponse } from "services/teams";

interface IProps {
  teams: TGetUserTeamsResponse["data"];
}

type TAddTeamForm = {
  teams: string[];
};

const AddTeamModal: FC<IProps> = ({ teams }) => {
  const { areaId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const teamOptions = useMemo<Option[] | undefined>(
    () =>
      teams?.map(team => ({
        label: team.attributes.name,
        value: team.id as string
      })),
    [teams]
  );

  const onClose = () => {
    history.push(`/areas/${areaId}`);
  };

  const onSave = async (data: UnpackNestedValue<TAddTeamForm>) => {
    try {
      await areaService.addTeamsToAreas(areaId, data.teams);
      toastr.success(intl.formatMessage({ id: "areas.details.teams.add.success" }), "");
      dispatch(getAreas());
      onClose();
    } catch (e: any) {
      toastr.error(intl.formatMessage({ id: "areas.details.teams.add.error" }), "");
      console.error(e);
    }
  };

  return (
    <FormModal<TAddTeamForm>
      isOpen
      onClose={onClose}
      onSave={onSave}
      modalTitle="areas.details.teams.add.title"
      modalSubtitle="areas.details.teams.add.select"
      submitBtnName="common.add"
      inputs={[
        {
          id: "select-teams",
          selectProps: {
            label: intl.formatMessage({ id: "areas.details.teams.add.select" }),
            placeholder: intl.formatMessage({ id: "areas.details.teams.add.selectPlaceholder" }),
            options: teamOptions,
            defaultValue: []
          },
          hideLabel: true,
          isMultiple: true,
          registerProps: {
            name: "teams",
            options: { required: true }
          },
          formatErrors: errors => errors.email
        }
      ]}
      actions={
        <Link className="c-button c-button--primary" to="/teams/create">
          <FormattedMessage id="teams.create" />
        </Link>
      }
    />
  );
};

export default AddTeamModal;
