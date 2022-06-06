import type { TGFWTeamsState } from "modules/gfwTeams";
import { IRowAction, IColumnOrder } from "components/ui/DataTable/DataTable";

export type TTeamDetailDataTable = TGFWTeamsState["members"][string][number]["attributes"];

export type TTeamsDetailDataTableAction = IRowAction<TTeamDetailDataTable>;

export type TTeamsDetailDataTableColumns = IColumnOrder<TTeamDetailDataTable>;
