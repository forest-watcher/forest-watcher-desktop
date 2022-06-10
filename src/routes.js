import { Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import querystring from "query-string";

import Areas from "./pages/areas/AreasContainer";
import AreasManage from "./pages/areas-manage/AreasManageContainer";
import Templates from "./pages/templates/TemplatesContainer";
import TemplatesManage from "./pages/templates-manage/TemplatesManageContainer";
import Teams from "./pages/teams/TeamsContainer";
import TeamDetail from "./pages/teams-detail/TeamDetailContainer";
import Settings from "./pages/settings/SettingsContainer";
import Reports from "./pages/reports/ReportsContainer";
import Login from "./pages/login/Login";

const getLoginComponent = ({ user, location }) => {
  const search = location.search || "";
  const queryParams = querystring.parse(search);
  const callbackUrl = queryParams.callbackUrl;
  const confirmToken = queryParams.confirmToken;

  if (!user.loggedIn && queryParams.token && (callbackUrl || confirmToken)) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          search: location.search
        }}
      />
    );
  } else if (user.loggedIn) {
    return <Redirect to="/areas" />;
  } else {
    return <Login callbackUrl={callbackUrl} />;
  }
};

const Routes = props => {
  const queryParams = querystring.parse(window.location.search || "");
  const { match, user, location, defaultComponent } = props;
  return (
    <Switch>
      <Route exact path="/" render={defaultComponent} />
      <Route path={`${match.url}login`} render={() => getLoginComponent({ user, location })} />
      {user.loggedIn ? (
        <Switch>
          <Route exact path={`${match.url}areas`} component={Areas} />
          <Route exact path={`${match.url}areas/create`} component={AreasManage} />
          <Route exact path={`${match.url}areas/:areaId/edit`} component={AreasManage} />
          <Route exact path={`${match.url}areas/:areaId`} component={AreasManage} />
          <Route exact path={`${match.url}templates`} component={Templates} />
          <Route exact path={`${match.url}templates/create`} component={TemplatesManage} />
          <Route exact path={`${match.url}templates/:templateId`} component={TemplatesManage} />
          <Route exact path={`${match.url}reports`} component={Reports} />
          <Route path={`${match.url}reports/:templateId`} component={Reports} />
          <Route exact path={`${match.url}teams`} component={Teams} />
          <Route exact path={`${match.url}teams/create`} render={args => <Teams isCreatingTeam {...args} />} />
          <Route exact path={`${match.url}teams/:teamId`} component={TeamDetail} />
          <Route
            exact
            path={`${match.url}teams/:teamId/delete`}
            render={args => <TeamDetail isDeletingTeam {...args} />}
          />
          <Route exact path={`${match.url}settings`} component={Settings} />
        </Switch>
      ) : (
        !queryParams.token && <Route path={`${match.url}`} render={() => <Redirect to="/login" />} />
      )}
    </Switch>
  );
};

Routes.defaultProps = {
  match: PropTypes.object,
  user: PropTypes.object,
  location: PropTypes.object,
  defaultComponent: PropTypes.func
};

export default Routes;
