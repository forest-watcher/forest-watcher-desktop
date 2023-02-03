import { useInvalidateGetAreaById } from "hooks/querys/areas/useGetAreaById";
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
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import PlusIcon from "assets/images/icons/PlusForButton.svg";
import useGetUserId from "hooks/useGetUserId";
import { fireGAEvent } from "helpers/analytics";
import { AreaActions, AreaLabel } from "types/analytics";

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

const AddTeamModal: FC<IProps> = ({ teams }) => {
  const { areaId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const userId = useGetUserId();
  const invalidateGetAreaById = useInvalidateGetAreaById();

  const teamOptions = useMemo<Option[] | undefined>(
    () =>
      teams
        ?.map(team => ({
          label: team.attributes.name,
          // @ts-ignore name doesn't exist yet, will be added in the future
          secondaryLabel: team?.attributes?.members?.map(member => member.name ?? member.email).join(", "),
          value: team.id as string,
          metadata: {
            canShow: Boolean(
              team?.attributes?.members?.find(member => member.userId === userId && member.role !== "monitor")
            )
          }
        }))
        .filter(team => team.metadata.canShow),
    [teams, userId]
  );

  const onClose = () => {
    history.goBack();
  };

  const onSave = async (data: UnpackNestedValue<TAddTeamForm>) => {
    try {
      await areaService.addTeamsToAreas(areaId, data.teams);
      toastr.success(intl.formatMessage({ id: "areas.details.teams.add.success" }), "");
      dispatch(getAreas());
      await invalidateGetAreaById(areaId);
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
        <Link
          className="c-button c-button--secondary"
          to={`/teams/create?backTo=/areas/${areaId}/team`}
          onClick={() =>
            fireGAEvent({
              category: "Areas",
              action: AreaActions.Managed,
              label: AreaLabel.CreateTeam
            })
          }
        >
          <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
          <FormattedMessage id="teams.create" />
        </Link>
      }
    />
  );
};

export default AddTeamModal;
