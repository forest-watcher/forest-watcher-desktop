import Input from "components/ui/Form/Input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { TemplateTableRowData } from "../Templates";

type TemplateSearchProps = {
  onSearch: (res: TemplateTableRowData[]) => void;
  data: TemplateTableRowData[];
};

const TemplatesSearch = ({ onSearch, data }: TemplateSearchProps) => {
  const intl = useIntl();
  const { register, watch } = useForm<{ search: string }>();

  const value = watch("search");

  useEffect(() => {
    if (!value) return onSearch(data);
    const newData = data
      .map(item => {
        const lowercaseValue = value.toLowerCase();
        const lowercaseTemplateName = item?.templateName?.toLowerCase();
        if (lowercaseTemplateName.includes(lowercaseValue)) return item;
        return null;
      })
      .filter(valid => valid) as TemplateTableRowData[];

    onSearch(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="ml-auto">
      <Input
        id="search"
        registered={register("search")}
        htmlInputProps={{
          type: "text",
          label: intl.formatMessage({ id: "filters.search" }),
          placeholder: intl.formatMessage({ id: "templates.search.placeholder" })
        }}
      />
    </div>
  );
};

export default TemplatesSearch;
