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
import { TGetTeamMembersResponse, TGetUserTeamsResponse } from "services/teams";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import PlusIcon from "assets/images/icons/PlusForButton.svg";

interface IProps {
  teams: TGetUserTeamsResponse["data"];
  users: { [teamId: string]: TGetTeamMembersResponse["data"] };
}

type TAddTeamForm = {
  teams: string[];
};

const addTeamSchema = yup
  .object()
  .shape({
    teams: yup.array().min(1).required()
  })
  .required();

const AddTeamModal: FC<IProps> = ({ teams, users }) => {
  const { areaId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const teamOptions = useMemo<Option[] | undefined>(
    () =>
      teams?.map(team => ({
        label: team.attributes.name,
        // @ts-ignore name doesn't exist yet, will be added in the future
        secondaryLabel: users[team.id]?.map(member => member.attributes.name ?? member.id).join(", "),
        value: team.id as string
      })),
    [teams, users]
  );

  const onClose = () => {
    history.goBack();
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
      useFormProps={{ resolver: yupResolver(addTeamSchema) }}
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
            name: "teams"
          },
          formatErrors: errors => errors.teams
        }
      ]}
      actions={
        <Link className="c-button c-button--secondary" to={`/teams/create?backTo=/areas/${areaId}/team`}>
          <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
          <FormattedMessage id="teams.create" />
        </Link>
      }
    />
  );
};

export default AddTeamModal;
