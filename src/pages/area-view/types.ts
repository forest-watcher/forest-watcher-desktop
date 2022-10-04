import { IRowAction, IColumnOrder } from "components/ui/DataTable/DataTable";

export type TTemplateDataTable = {
  id: string;
  name?: string;
  openAssignments: number;
};

export type TTemplateDataTableAction = IRowAction<TTemplateDataTable>;

export type TTemplateDataTableColumns = IColumnOrder<TTemplateDataTable>;

export type TTeamDataTable = {
  id: string;
  name?: string;
  openAssignments: number;
  reports: number;
};

export type TTeamDataTableAction = IRowAction<TTeamDataTable>;

export type TTeamDataTableColumns = IColumnOrder<TTeamDataTable>;
