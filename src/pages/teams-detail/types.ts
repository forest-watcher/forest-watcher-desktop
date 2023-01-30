import { IRowAction, IColumnOrder } from "components/ui/DataTable/DataTable";

export type TTeamDetailDataTable = {
  id: string | number;
  name?: string;
  email: string;
  status: string;
  statusSuffix: string;
  userId?: string;
};

export type TAreaDataTable = {
  id: string;
  name: string;
  templates: string;
};

export type TTeamsDetailDataTableAction = IRowAction<TTeamDetailDataTable>;

export type TTeamsDetailDataTableColumns = IColumnOrder<TTeamDetailDataTable>;

export type TAreaDataTableColumns = IColumnOrder<TAreaDataTable>;

export type TAreaDataTableAction = IRowAction<TAreaDataTable>;
