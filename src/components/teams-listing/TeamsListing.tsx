import { FC } from "react";
import styles from "./teams.module.scss";
import Card from "../ui/Card/Card";
import { Link } from "react-router-dom";
import EditIcon from "../../assets/images/icons/Edit.svg";
import { FormattedMessage } from "react-intl";
import { TGFWTeamsState } from "modules/gfwTeams";

interface IProps {
  teams: TGFWTeamsState["data"];
}

const TeamsListing: FC<IProps> = props => {
  const { teams } = props;

  return (
    <div className={styles["c-teams__listing"]}>
      {teams.map(team => (
        <div className={styles["c-teams__grid-item"]} key={team.id}>
          <Card size="large" as={Link} to={`/teams/${team.id}`} className={styles["c-teams__card"]}>
            <div className="c-card__content-flex">
              <div>
                <Card.Title className="u-margin-top-none">{team.attributes.name}</Card.Title>
              </div>
              <Card.Cta iconSrc={EditIcon}>
                <FormattedMessage id="common.manage" />
              </Card.Cta>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TeamsListing;
