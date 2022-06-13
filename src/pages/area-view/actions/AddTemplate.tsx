import { FC, useEffect } from "react";
import FormModal from "components/modals/FormModal";
import { useHistory, useParams } from "react-router-dom";
import { TParams } from "../AreaView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useIntl } from "react-intl";
import { teamService } from "services/teams";
import { getTeamMembers } from "modules/gfwTeams";
import { toastr } from "react-redux-toastr";
import { UnpackNestedValue } from "react-hook-form";
import { useAppDispatch } from "hooks/useRedux";
import { TErrorResponse } from "constants/api";

interface IProps {}

type TAddTemplateForm = {
  templates: Array<string>;
};

const AddTemplateModal: FC<IProps> = props => {
  const { areaId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const onClose = () => {
    history.push(`/areas/${areaId}`);
  };

  const onSave = async (data: UnpackNestedValue<TAddTemplateForm>) => {
    try {
      // await teamService.addTeamMembers(teamId, {
      //   users: [
      //     {
      //       email: data.email,
      //       role: memberRole
      //     }
      //   ]
      // });
      // // Refetch the Team members
      // dispatch(getTeamMembers(teamId));
      console.log(data);
      onClose();
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "areas.details.templates.add.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
      console.error(e);
    }
  };

  return (
    <FormModal<TAddTemplateForm>
      isOpen
      onClose={onClose}
      onSave={onSave}
      modalTitle="areas.details.templates.add.title"
      modalSubtitle="areas.details.templates.add.select"
      submitBtnName="common.add"
      inputs={[
        {
          id: "select-templates",
          selectProps: {
            label: intl.formatMessage({ id: "areas.details.templates.add.select" }),
            placeholder: intl.formatMessage({ id: "areas.details.templates.add.selectPlaceholder" }),
            options: [
              { label: "select me", secondaryLabel: "anotherone", value: "1" },
              { label: "select me 2", secondaryLabel: "anotherone 2", value: "2" }
            ],
            defaultValue: []
          },
          hideLabel: true,
          isMultiple: true,
          registerProps: {
            name: "templates",
            options: { required: true }
          },
          formatErrors: errors => errors.email
        }
      ]}
    />
  );
};

export default AddTemplateModal;
