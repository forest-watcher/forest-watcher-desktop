import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import { sortByString } from "helpers/table";
import { useMemo } from "react";
import { useIntl } from "react-intl";

type TemplateAreaTableRowData = {
  id: string;
  name: string;
};

type TemplateAreasProps = {
  areas: { id: string; name: string }[];
};

const TemplateAreas = ({ areas }: TemplateAreasProps) => {
  const intl = useIntl();
  const rows = useMemo<TemplateAreaTableRowData[]>(() => {
    if (!areas || areas.length === 0) return [];
    return areas.map(area => ({
      id: area.id,
      name: area.name
    }));
  }, [areas]);

  return (
    <Article className="my-[60px]">
      <h4 className="text-neutral-700 text-2xl mb-5">
        {intl.formatMessage({ id: "template.areas" })} ({areas?.length ?? 0})
      </h4>
      <DataTable
        className="u-w-100"
        rows={rows}
        isPaginated
        selectFindGetter="id"
        columnOrder={[
          {
            key: "name",
            name: intl.formatMessage({ id: "templates.table.area" }),
            sortCompareFn: sortByString
          },
          {
            key: "id",
            name: "   ",
            rowLabel: () => "View",
            rowHref: ({ id }) => `/areas/${id}`,
            rowHrefClassNames: "text-primary-500 font-medium uppercase",
            rowCellClassNames: "!text-right"
          }
        ]}
      />
    </Article>
  );
};

export default TemplateAreas;
