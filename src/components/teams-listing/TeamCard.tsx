import { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./teams.module.scss";
import Card from "../ui/Card/Card";
import EditIcon from "../../assets/images/icons/Edit.svg";
import { FormattedMessage } from "react-intl";
import { TGFWTeamsState } from "../../modules/gfwTeams";

interface IProps {
  team: TGFWTeamsState["data"][number];
}

const TeamCard: FC<IProps> = props => {
  const { team } = props;

  return (
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
  );
};

export default TeamCard;
