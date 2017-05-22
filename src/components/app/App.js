import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import querystring from 'query-string';

// Pages
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/DashboardContainer';
import Areas from '../pages/areas/AreasContainer';
import Reports from '../pages/reports/ReportsContainer';
import Answers from '../pages/answers/AnswersContainer';
import AnswersDetail from '../pages/answers-detail/AnswersDetailContainer';

import Nav from '../semantic/nav/NavContainer';

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

  getDashboardPage = () => {
    const { location, history } = this.props;
    const search = location.search || '';
    const queryParams = querystring.parse(search);
    if (queryParams.token) {
      const newSearch = querystring.stringify({ ...queryParams, token: undefined });
      history.replace('/dashboard', { search: newSearch });
    }
    return <Dashboard />;
  }

  render() {
    const { match, user, userChecked } = this.props;
    if (!userChecked) return null;

    return (
      <main role="main" className="l-main">
        <Nav />
        <div className="l-content">
          <Route exact path="/" render={this.getRootComponent} />
          {user.loggedIn &&
            <div>
              <Route path={`${match.url}dashboard`} render={this.getDashboardPage} />
              <Route path={`${match.url}areas`} component={Areas} />
              <Switch>
                <Route exact path={`${match.url}reports`} component={Reports} />
                <Route exact path={`${match.url}reports/:reportId`} component={Answers} />
                <Route path={`${match.url}reports/:reportId/:answerId`} component={AnswersDetail} />
              </Switch>
            </div>
          }
          {!user.loggedIn && <Redirect to="/" />}
        </div>
      </main>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userChecked: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  checkLogged: PropTypes.func.isRequired
};

export default App;
