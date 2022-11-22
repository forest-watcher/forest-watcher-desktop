import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

type TemplateHeaderProps = {
  editable?: boolean;
  onEdit?: () => void;
};

const TemplateHeader = ({ editable = false, onEdit }: TemplateHeaderProps) => {
  const history = useHistory();

  return (
    <div className="bg-neutral-700">
      <section className="row column py-7">
        <button onClick={() => history.goBack()} className="flex items-center gap-1">
          <Icon name="chevron-left" className="text-primary-500" size={10} />
          <p className="text-primary-500">
            <FormattedMessage id="template.back" />
          </p>
        </button>

        <div className="flex justify-between items-center mt-5">
          <h1 className="font-base text-[36px] font-light text-neutral-300">
            <FormattedMessage id={"template.details"} />
          </h1>
          <OptionalWrapper data={editable}>
            <Button onClick={onEdit}>
              <FormattedMessage id={"common.edit"} />
            </Button>
          </OptionalWrapper>
        </div>
      </section>
    </div>
  );
};

export default TemplateHeader;