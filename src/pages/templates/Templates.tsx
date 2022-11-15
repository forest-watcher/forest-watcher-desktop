import { useAccessToken } from "hooks/useAccessToken";
import { useMemo, useState } from "react";
import { useGetV3GfwAreasUser, useGetV3GfwTemplates } from "generated/core/coreComponents";
import { LOCALES_LIST } from "../../constants/locales";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import Article from "components/layouts/Article";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import EmptyState from "components/ui/EmptyState/EmptyState";
import DataTable from "components/ui/DataTable/DataTable";
import { sortByDateString, sortByString } from "helpers/table";
import { useIntl } from "react-intl";
import TemplatesHeader from "./components/TemplatesHeader";
import useTemplatesFilter from "./useTemplatesFilter";
import DataFilter from "components/ui/DataFilter/DataFilter";
import TemplatesSearch from "./components/TemplatesSearch";

export type TemplateTableRowData = {
  id: string;
  templateName: string;
  version: string;
  area: string;
  language: string;
  status: string;
  reports: number;
  formattedVersion: string;
};

export type TemplatesFilterFields = {
  area: string;
  search: string;
};

const _Templates = () => {
  const intl = useIntl();
  const { httpAuthHeader } = useAccessToken();

  // Queries
  const { data: areasData, isLoading: areasLoading } = useGetV3GfwAreasUser({ headers: httpAuthHeader });
  const { data: templatesData, isLoading: templatesLoading } = useGetV3GfwTemplates(
    { headers: httpAuthHeader },
    { enabled: !!areasData }
  );

  // @ts-expect-error
  const rows = useMemo<TemplateTableRowData[]>(() => {
    if (!templatesData?.data) return [];
    return templatesData?.data?.map(template => {
      // @ts-expect-error
      const aoi = areasData?.data?.find(area => area?.attributes?.templateId === template.id);
      return {
        id: template.id,
        area: aoi?.attributes?.name ?? "",
        language: LOCALES_LIST.find(loc => loc.code === template.attributes?.defaultLanguage)?.name,
        reports: template?.attributes?.answersCount || "-",
        status: template.attributes?.status,
        version: template.attributes?.createdAt,
        formattedVersion: intl.formatDate(template.attributes?.createdAt, {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        }),
        // @ts-expect-error
        templateName: template?.attributes?.name[template.attributes.defaultLanguage]
      };
    });
  }, [templatesData, areasData, intl]);

  // Filters
  const { filters } = useTemplatesFilter(rows);
  const [filteredRows, setFilteredRows] = useState<TemplateTableRowData[]>(rows);

  return (
    <div className="relative">
      <TemplatesHeader />
      <LoadingWrapper loading={areasLoading || templatesLoading}>
        <Article className="mt-10">
          <OptionalWrapper
            data={rows.length > 0}
            elseComponent={
              <EmptyState
                title={intl.formatMessage({ id: "templates.list.empty.title" })}
                text={intl.formatMessage({ id: "templates.list.empty.text" })}
              />
            }
          >
            <DataFilter
              filters={filters}
              onFiltered={(res: TemplateTableRowData[]) => setFilteredRows(res)}
              options={rows}
              className="c-data-filter--above-table"
            >
              <TemplatesSearch onSearch={(res: TemplateTableRowData[]) => setFilteredRows(res)} data={rows} />
            </DataFilter>
            <DataTable
              className="u-w-100"
              rows={filteredRows}
              isPaginated
              selectFindGetter="id"
              columnOrder={[
                {
                  key: "templateName",
                  name: intl.formatMessage({ id: "templates.table.template" }),
                  sortCompareFn: sortByDateString
                },
                {
                  key: "version",
                  name: intl.formatMessage({ id: "templates.table.version" }),
                  rowLabel: (_, value) => {
                    return !Array.isArray(value)
                      ? intl.formatDate(value, { day: "2-digit", month: "2-digit", year: "2-digit" })
                      : "";
                  },
                  sortCompareFn: sortByDateString
                },
                {
                  key: "area",
                  name: intl.formatMessage({ id: "templates.table.area" }),
                  sortCompareFn: sortByString
                },
                {
                  key: "language",
                  name: intl.formatMessage({ id: "templates.table.language" }),
                  sortCompareFn: sortByString
                },
                {
                  key: "status",
                  name: intl.formatMessage({ id: "templates.table.status" }),
                  rowLabel: ({ status }) => status[0].toUpperCase() + status.slice(1),
                  sortCompareFn: sortByString
                },
                {
                  key: "reports",
                  name: intl.formatMessage({ id: "templates.table.reports" }),
                  sortCompareFn: sortByString
                },
                {
                  key: "id",
                  name: "   ",
                  rowLabel: () => "View",
                  rowHref: ({ id }) => `/templates/${id}`,
                  rowHrefClassNames: "text-primary-500 font-medium"
                }
              ]}
            />
          </OptionalWrapper>
        </Article>
      </LoadingWrapper>
    </div>
  );
};

export default _Templates;
