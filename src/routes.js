import { Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import querystring from "query-string";

import Areas from "./pages/areas/AreasContainer";
import AreasManage from "./pages/area-view/AreaViewContainer";
import AreaEdit from "./pages/area-edit/AreaEditContainer";
import Templates from "./pages/templates/TemplatesContainer";
import TemplatesManage from "./pages/templates-manage/TemplatesManageContainer";
import Teams from "./pages/teams/TeamsContainer";
import TeamsInvitations from "pages/teams/invitation/InvitationContainer";
import TeamDetail from "./pages/teams-detail/TeamDetailContainer";
import Settings from "./pages/settings/SettingsContainer";
import Reports from "./pages/reports/ReportsContainer";
import Login from "./pages/login/Login";
import SignUpAndReset from "./pages/login/SignUpAndReset";

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
    return <Login />;
  }
};

const Routes = props => {
  const queryParams = querystring.parse(window.location.search || "");
  const { match, user, location, defaultComponent } = props;
  return (
    <Switch>
      <Route exact path="/" render={defaultComponent} />
      <Route path={`${match.url}login`} render={() => getLoginComponent({ user, location })} />
      {!user.loggedIn && (
        <Switch>
          <Route exact path={`${match.url}sign-up`} component={SignUpAndReset} />
          <Route
            exact
            path={`${match.url}forgotten-password`}
            render={args => <SignUpAndReset isResetPassword {...args} />}
          />
          {/* After the user logs in with a social login they are redirected
           *  to GFW with their JWT in a query param, then the page fetches
           *  their info using the JWT. Without '!queryParams.token' the
           *  login page would flicker while their info is being fetched */}
          {!queryParams.token && <Route path="*" render={() => <Redirect to="/login" />} />}
        </Switch>
      )}
      {user.loggedIn && (
        <Switch>
          <Route exact path={[`${match.url}areas`, `${match.url}areas/export`]} component={Areas} />
          <Route path={`${match.url}areas/create`} component={AreaEdit} />
          <Route path={`${match.url}areas/:areaId/edit`} component={AreaEdit} />
          <Route path={`${match.url}areas/:areaId`} component={AreasManage} />
          <Route exact path={`${match.url}templates`} component={Templates} />
          <Route exact path={`${match.url}templates/create`} component={TemplatesManage} />
          <Route exact path={`${match.url}templates/:templateId`} component={TemplatesManage} />

          <Route path={[`${match.url}reporting/:reportingTab?`]} component={Reports} />

          <Route exact path={`${match.url}teams`} component={Teams} />
          <Route path={`${match.url}teams/invitations`} component={TeamsInvitations} />
          <Route exact path={`${match.url}teams/create`} render={args => <Teams isCreatingTeam {...args} />} />
          <Route exact path={`${match.url}teams/:teamId`} component={TeamDetail} />
          <Route
            exact
            path={`${match.url}teams/:teamId/edit`}
            render={args => <TeamDetail isEditingTeam {...args} />}
          />
          <Route
            exact
            path={`${match.url}teams/:teamId/delete`}
            render={args => <TeamDetail isDeletingTeam {...args} />}
          />
          <Route
            exact
            path={`${match.url}teams/:teamId/add/:memberRole`}
            render={args => <TeamDetail isAddingTeamMember {...args} />}
          />
          <Route
            exact
            path={`${match.url}teams/:teamId/edit/:memberId/:memberRole`}
            render={args => <TeamDetail isEditingTeamMember {...args} />}
          />
          <Route
            exact
            path={`${match.url}teams/:teamId/remove/:memberId`}
            render={args => <TeamDetail isRemovingTeamMember {...args} />}
          />
          <Route exact path={`${match.url}settings`} component={Settings} />
          <Route path="*">
            <Redirect to="/areas" />
          </Route>
        </Switch>
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
