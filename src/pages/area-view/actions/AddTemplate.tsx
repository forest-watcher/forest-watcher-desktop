import { FC, useMemo } from "react";
import FormModal from "components/modals/FormModal";
import { Link, useHistory, useParams } from "react-router-dom";
import { TParams } from "../AreaView";
import { FormattedMessage, useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { UnpackNestedValue } from "react-hook-form";
import { TGetTemplates } from "services/reports";
import { Option } from "types";
import { areaService } from "services/area";
import { useAppDispatch } from "hooks/useRedux";
import { getAreas, getAreasInUsersTeams } from "modules/areas";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import PlusIcon from "assets/images/icons/PlusForButton.svg";

interface IProps {
  templates: TGetTemplates["data"];
  onAdd?: () => void;
}

type TAddTemplateForm = {
  templates: string[];
};

const addTemplateSchema = yup
  .object()
  .shape({
    templates: yup.array().min(1).required()
  })
  .required();

const AddTemplateModal: FC<IProps> = ({ templates, onAdd }) => {
  const { areaId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
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
      dispatch(getAreas(true));
      dispatch(getAreasInUsersTeams(true));
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
      useFormProps={{ resolver: yupResolver(addTemplateSchema) }}
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
            name: "templates"
          },
          formatErrors: errors => errors.templates
        }
      ]}
      actions={
        <Link className="c-button c-button--secondary" to={`/templates/create?backTo=/areas/${areaId}/template/add`}>
          <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
          <FormattedMessage id="templates.create" />
        </Link>
      }
    />
  );
};

export default AddTemplateModal;
