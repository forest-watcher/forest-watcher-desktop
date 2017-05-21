import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import queryString from 'query-string';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPageContainer';
import AreasPage from '../pages/areas/AreasPageContainer';
import ReportsPage from '../pages/reports/ReportsPageContainer';
import QuestionairesPage from '../pages/questionaires/QuestionairesPageContainer';
import AnswersPage from '../pages/answers/AnswersPageContainer';
import AnswersDetailPage from '../pages/answers-detail/AnswersDetailPageContainer';

import TopBar from '../topbar/TopBarContainer';

class App extends React.Component {

  componentWillMount() {
    this.props.checkLogged(this.props.location.search);
  }

  getRootComponent = () => {
    const { user, location } = this.props;
    const search = location.search || '';
    const queryParams = queryString.parse(search);
    if (!user.loggedIn && !queryParams.token) return <LoginPage />;
    return <Redirect to="/dashboard" />;
  }

  render() {
    const { match, user, userChecked } = this.props;
    if (!userChecked) return null;

    return (
      <main role="main" className="l-main">
        <TopBar />
        <div className="l-content">
          <Route exact path="/" render={this.getRootComponent}/>
          {user.loggedIn &&
            <div>
              <Route path={`${match.url}dashboard`} component={DashboardPage}/>
              <Route path={`${match.url}areas`} component={AreasPage}/>
              <Route path={`${match.url}reports`} component={ReportsPage}/>
              <Switch>
                <Route exact path={`${match.url}templates`} component={QuestionairesPage}/>
                <Route exact path={`${match.url}templates/:reportId`} component={AnswersPage} />
                <Route path={`${match.url}templates/:reportId/:answerId`} component={AnswersDetailPage} />
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
