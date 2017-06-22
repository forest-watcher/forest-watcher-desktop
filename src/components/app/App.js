import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import querystring from 'query-string';
import ReduxToastr from 'react-redux-toastr'

// Pages
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/DashboardContainer';
import Areas from '../pages/areas/AreasContainer';
import AreasManage from '../pages/areas-manage/AreasManageContainer';
import Reports from '../pages/reports/ReportsContainer';
import Answers from '../pages/answers/AnswersContainer';
import AnswersDetail from '../pages/answers-detail/AnswersDetailContainer';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import Nav from '../layouts/Nav';

class App extends React.Component {

  componentWillMount() {
    this.props.checkLogged(this.props.location.search);
  }

  getRootComponent = () => {
    const { user, location } = this.props;
    const search = location.search || '';
    const queryParams = querystring.parse(search);
    if (!user.loggedIn && !queryParams.token) return <Login />;
    return <Redirect to="/dashboard" />;
  }

  render() {
    const { match, user, userChecked, logout } = this.props;
    if (!userChecked) return null;

    return (
      <div>
        <header className="l-header" role="banner">
          <Nav loggedIn={user.loggedIn} logout={logout} />
        </header>
        <main role="main" className="l-main">
          <Route exact path="/" render={this.getRootComponent} />
          {user.loggedIn &&
            <div>
              <Route path={`${match.url}dashboard`} component={Dashboard} />
              <Switch>
                <Route exact path={`${match.url}areas`} component={Areas} />
                <Route exact path={`${match.url}areas/create`} component={AreasManage} />
                <Route exact path={`${match.url}areas/:areaId`} component={AreasManage} />
              </Switch>
              <Switch>
                <Route exact path={`${match.url}reports`} component={Reports} />
                <Route exact path={`${match.url}reports/:reportId`} component={Answers} />
                <Route path={`${match.url}reports/:reportId/:answerId`} component={AnswersDetail} />
              </Switch>
            </div>
          }
          {!user.loggedIn && <Redirect to="/" />}
          <ReduxToastr position="bottom-right" />
        </main>
      </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  userChecked: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  checkLogged: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default App;
