import { FC, ReactNode, useEffect, useState } from "react";
import { Route, Switch, Redirect, useLocation, useParams, useRouteMatch, useHistory } from "react-router-dom";

import Areas from "pages/areas/Areas";
import AreasManage from "pages/area-view/AreaViewContainer";
import AreaEdit from "pages/area-edit/AreaEditContainer";
import Teams from "pages/teams/Teams";
import TeamsInvitations from "pages/teams/invitation/Invitation";
import TeamDetail from "pages/teams-detail/TeamDetail";
import Reports from "pages/reports/Reports";
import Login from "pages/login/Login";
import SignUpAndReset from "pages/login/SignUpAndReset";
import { useRouteHistoryStack } from "hooks/useRouteHistoryStack";
import Report from "pages/reports/report/Report";
import Templates from "pages/templates/Templates";
import Layers from "pages/layers/Layers";
import TemplateDetail from "pages/template-detail/TemplateDetail";
import Assignment from "pages/assignment/Assignment";
import { useSelector } from "react-redux";
import { RootState } from "store";
import TemplateEdit from "pages/template-edit/TemplateEdit";
import TemplateCreate from "pages/template-edit/TemplateCreate";
import Help from "pages/help/Help";

interface IParams {
  token?: string;
  confirmToken?: string;
  callbackUrl?: string;
}

interface IProps {
  defaultComponent: () => ReactNode;
}

const LoginComponent = () => {
  const location = useLocation();
  const queryParams = useParams<IParams>();
  const callbackUrl = queryParams.callbackUrl;
  const confirmToken = queryParams.confirmToken;
  const user = useSelector((state: RootState) => state.user);

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

const Routes: FC<IProps> = props => {
  const { defaultComponent } = props;

  const location = useLocation();
  const match = useRouteMatch();
  const queryParams = useParams<IParams>();
  const user = useSelector((state: RootState) => state.user);

  const [route, setRoute] = useState({
    to: location.pathname,
    from: location.pathname //--> previous pathname
  });

  useRouteHistoryStack();

  useEffect(() => {
    setRoute(prev => ({ to: location.pathname, from: prev.to }));
  }, [location.pathname]);

  useEffect(() => {
    // If top level change - trigger a scroll to top.
    const fromSplit = route.from.split("/");
    const toSplit = route.to.split("/");

    // To detect a top level change, split the from and to pathnames and
    // compare if they are different
    if (fromSplit[1] && toSplit[1] && fromSplit[1] !== toSplit[1]) {
      window.scrollTo(0, 0);
    }
  }, [route.from, route.to]);

  return (
    <Switch>
      <Route exact path="/" render={defaultComponent} />
      <Route path={`${match.url}login`} component={LoginComponent} />
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
          <Route exact path={`${match.url}templates/create`} component={TemplateCreate} />
          <Route exact path={`${match.url}templates/:templateId/edit`} component={TemplateEdit} />
          <Route path={`${match.url}templates/:templateId`} component={TemplateDetail} />
          <Route path={`${match.url}reporting/reports/:reportId/answers/:answerId`} component={Report} />
          <Route path={[`${match.url}reporting/:reportingTab?`]} component={Reports} />
          {/* TODO update these routes to use nested routes */}
          <Route exact path={`${match.url}teams`} component={Teams} />
          <Route path={`${match.url}teams/invitations`} component={TeamsInvitations} />
          <Route exact path={`${match.url}teams/create`} render={args => <Teams isCreatingTeam {...args} />} />
          <Route exact path={`${match.url}teams/:teamId`} component={TeamDetail} />
          <Route path={`${match.url}assignment/:id`} component={Assignment} />
          {/*ToDo: Use useRouteMatch()*/}
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
          <Route
            exact
            path={`${match.url}teams/:teamId/removeArea/:areaId`}
            render={args => <TeamDetail isDeletingTeamArea {...args} />}
          />
          <Route exact path={`${match.url}layers`} component={Layers} />
          <Route path={`${match.url}help`} component={Help} />
          <Route path="*">
            <Redirect to="/areas" />
          </Route>
        </Switch>
      )}
    </Switch>
  );
};

export default Routes;
