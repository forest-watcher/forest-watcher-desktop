import { IRowAction, IColumnOrder } from "components/ui/DataTable/DataTable";

export type TTeamDetailDataTable = {
  id: string;
  name?: string;
  email: string;
  status: string;
  statusSuffix: string;
  userId?: string;
};

export type TTeamsDetailDataTableAction = IRowAction<TTeamDetailDataTable>;

export type TTeamsDetailDataTableColumns = IColumnOrder<TTeamDetailDataTable>;
