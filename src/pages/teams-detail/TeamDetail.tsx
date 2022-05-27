import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TPropsFromRedux } from "./TeamDetailContainer";
import { makeManager, makeMonitor, removeMember } from "./actions";
import Hero from "components/layouts/Hero";
import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import type { TTeamDetailDataTable, TTeamsDetailDataTableColumns } from "./types";
import Button from "../../components/ui/Button/Button";
import { FormattedMessage } from "react-intl";

type TParams = {
  teamId: string;
};

export interface IOwnProps extends RouteComponentProps<TParams> {}

type IProps = IOwnProps & TPropsFromRedux;

const columnOrder: TTeamsDetailDataTableColumns[] = [
  { key: "userId", name: "teams.details.table.header.name" },
  { key: "email", name: "teams.details.table.header.user" },
  { key: "status", name: "teams.details.table.header.status" }
];

const TeamDetail: FC<IProps> = props => {
  const { team, teamMembers } = props;

  // ToDo: Create a util for this
  const [manages, monitors] = useMemo(
    () =>
      teamMembers.reduce<[typeof teamMembers, typeof teamMembers]>(
        (acc, teamMember) => {
          if (
            (teamMember.attributes.role === "administrator" || teamMember.attributes.role === "manager") &&
            teamMember.attributes.userId
          ) {
            acc[0].push(teamMember);
          } else if (teamMember.attributes.userId) {
            acc[1].push(teamMember);
          }
          return acc;
        },
        [[], []]
      ),
    [teamMembers]
  );

  const deleteTeam = () => {
    // ToDo
  };

  // ToDo: On initial load team and members won't have been fetched
  if (!team || !teamMembers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero
        title="teams.details.name"
        titleValues={{ name: team.attributes.name }}
        action={{ name: "teams.details.delete", variant: "secondary-light-text", callback: deleteTeam }}
        backLink={{ name: "teams.details.back", to: "/teams" }}
      />
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.managers"
          titleValues={{ num: manages.length }}
          actions={
            <Button variant="primary">
              <FormattedMessage id="teams.details.add.managers" />
            </Button>
          }
        >
          <DataTable<TTeamDetailDataTable>
            className="u-w-100"
            rows={manages.map(m => m.attributes)}
            columnOrder={columnOrder}
            rowActions={[makeMonitor, removeMember]}
          />
        </Article>
      </div>
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.monitors"
          titleValues={{ num: monitors.length }}
          actions={
            <Button variant="primary">
              <FormattedMessage id="teams.details.add.monitors" />
            </Button>
          }
        >
          <DataTable<TTeamDetailDataTable>
            className="u-w-100"
            rows={monitors.map(m => m.attributes)}
            columnOrder={columnOrder}
            rowActions={[makeManager, removeMember]}
          />
        </Article>
      </div>
    </>
  );
};

export default TeamDetail;
