import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import queryString from 'query-string';

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
    const queryParams = queryString.parse(search);
    if (!user.loggedIn && !queryParams.token) return <Login />;
    return <Redirect to="/dashboard" />;
  }

  render() {
    const { match, user, userChecked } = this.props;
    if (!userChecked) return null;

    return (
      <main role="main" className="l-main">
        <Nav />
        <div className="l-content">
          <Route exact path="/" render={this.getRootComponent}/>
          {user.loggedIn &&
            <div>
              <Route path={`${match.url}dashboard`} component={Dashboard}/>
              <Route path={`${match.url}areas`} component={Areas}/>
              <Switch>
                <Route exact path={`${match.url}reports`} component={Reports}/>
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

export default App;
