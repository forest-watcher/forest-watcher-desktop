import { FC, useMemo } from "react";
import Card from "../../ui/Card/Card";
import EditIcon from "assets/images/icons/Edit.svg";
import { FormattedMessage } from "react-intl";
import { TGFWTeamsState } from "modules/gfwTeams";

export type IProps = {
  team: TGFWTeamsState["data"][number];
};

const TeamCard: FC<IProps> = props => {
  const { team } = props;

  const [managers, monitors] = useMemo(() => {
    if (team.attributes.members) {
      return team.attributes.members.reduce<[typeof team.attributes.members, typeof team.attributes.members]>(
        (acc, teamMember) => {
          if ((teamMember.role === "administrator" || teamMember.role === "manager") && teamMember.userId) {
            acc[0].push(teamMember);
          } else if (teamMember.userId) {
            acc[1].push(teamMember);
          }
          return acc;
        },
        [[], []]
      );
    } else {
      return [[], []];
    }
  }, [team]);

  return (
    <Card size="large" className="c-teams__card">
      <div className="c-teams__title">
        <div className="c-teams__title-text">
          <Card.Title className="u-margin-top-none">{team.attributes.name}</Card.Title>
        </div>
        <Card.Cta to={`/teams/${team.id}`} iconSrc={EditIcon}>
          <FormattedMessage id="common.manage.team" />
        </Card.Cta>
      </div>

      <Card size="large" className={"c-teams__card c-teams--nested-card"}>
        <div>
          <h3 className="c-teams__sub-title">
            <FormattedMessage id="teams.managers" values={{ num: managers.length }} />
          </h3>
          <p>{managers.map(i => i.userId).join(", ")}</p>
        </div>
        <div>
          <h3 className="c-teams__sub-title">
            <FormattedMessage id="teams.monitors" values={{ num: monitors.length }} />
          </h3>
          <p>{monitors.map(i => i.userId).join(", ")}</p>
        </div>
      </Card>

      <Card size="large" className={"c-teams__card c-teams--nested-card"}>
        <div className="flex-container align-justify">
          <div className="c-teams__area-text">
            <h3 className="c-teams__sub-title">
              <FormattedMessage id="teams.summary.areas" />
            </h3>
            <p>{team.attributes.areas?.join(", ")}</p>
          </div>
          <Card.Cta to={"/areas"} iconSrc={EditIcon}>
            <FormattedMessage id="common.manage.area" />
          </Card.Cta>
        </div>
      </Card>
    </Card>
  );
};

export default TeamCard;
