import { useAccessToken } from "hooks/useAccessToken";
import { useMemo, useState } from "react";
import { useGetV3GfwTemplatesLatest, useGetV3GfwTemplatesPublic } from "generated/core/coreComponents";
import { LOCALES_LIST } from "../../constants/locales";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import Article from "components/layouts/Article";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import EmptyState from "components/ui/EmptyState/EmptyState";
import DataTable from "components/ui/DataTable/DataTable";
import { sortByDateString, sortByString } from "helpers/table";
import { FormattedMessage, useIntl } from "react-intl";
import useTemplatesFilter from "./useTemplatesFilter";
import DataFilter from "components/ui/DataFilter/DataFilter";
import TemplatesSearch from "./components/TemplatesSearch";
import { Link } from "react-router-dom";
import Hero from "components/layouts/Hero/Hero";
import { getTemplateDate } from "helpers/template";
import useGetTemplates from "hooks/useGetTemplates";

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

const Templates = () => {
  const intl = useIntl();
  const { templates, isLoading } = useGetTemplates();

  // @ts-expect-error
  const rows = useMemo<TemplateTableRowData[]>(() => {
    return templates.map(template => {
      const parsedDate = template.attributes ? getTemplateDate(template.attributes) : "";
      const areasStr = template.attributes?.areas?.map(area => area.name).join(", ");

      return {
        id: template.id,
        area: template.attributes?.public ? "-" : areasStr || "-",
        language: LOCALES_LIST.find(loc => loc.code === template.attributes?.defaultLanguage)?.name,
        reports: template?.attributes?.answersCount || "-",
        status: template.attributes?.status,
        version: template.attributes?.createdAt,
        formattedVersion: intl.formatDate(parsedDate, {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        }),
        // @ts-expect-error
        templateName: template?.attributes?.name[template.attributes.defaultLanguage]
      };
    });
  }, [templates, intl]);

  // Filters
  const { filters } = useTemplatesFilter(rows);
  const [filteredRows, setFilteredRows] = useState<TemplateTableRowData[]>(rows);

  return (
    <div className="relative">
      <Hero
        title="templates.name"
        actions={
          <Link className="c-button c-button--primary" to="/templates/create">
            <FormattedMessage id="templates.createTemplate" />
          </Link>
        }
      />
      <LoadingWrapper loading={isLoading}>
        <Article className="my-10">
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
                  key: "formattedVersion",
                  name: intl.formatMessage({ id: "templates.table.version" }),
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
                  rowHrefClassNames: "text-primary-500 font-medium uppercase"
                }
              ]}
            />
          </OptionalWrapper>
        </Article>
      </LoadingWrapper>
    </div>
  );
};

export default Templates;
