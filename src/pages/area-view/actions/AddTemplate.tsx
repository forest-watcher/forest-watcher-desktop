import { FC, useEffect, useMemo } from "react";
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
import { TGetTemplates } from "services/reports";
import { Option } from "types";
import { areaService } from "services/area";

interface IProps {
  templates: TGetTemplates["data"];
}

type TAddTemplateForm = {
  templates: string[];
};

const AddTemplateModal: FC<IProps> = ({ templates }) => {
  const { areaId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const templateOptions = useMemo<Option[] | undefined>(
    () =>
      templates?.map(template => ({
        // @ts-ignore template.attributes.name has incorrect type
        label: template.attributes.name[template.attributes.defaultLanguage],
        value: template.id as string
      })),
    [templates]
  );

  const onClose = () => {
    history.push(`/areas/${areaId}`);
  };

  const onSave = async (data: UnpackNestedValue<TAddTemplateForm>) => {
    try {
      await areaService.addTemplatesToAreas(areaId, data.templates);
      toastr.success(intl.formatMessage({ id: "areas.details.templates.add.success" }), "");
      onClose();
    } catch (e: any) {
      toastr.error(intl.formatMessage({ id: "areas.details.templates.add.error" }), "");
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
            options: templateOptions,
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
