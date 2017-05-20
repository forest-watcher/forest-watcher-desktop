import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import queryString from 'query-string';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPageContainer';
import AreasPage from '../pages/areas/AreasPageContainer';
import ReportsPage from '../pages/reports/ReportsPageContainer';
import QuestionairesPage from '../pages/questionaires/QuestionairesPageContainer';
import AnswersPage from '../pages/answers/AnswersPage';
import AnswersDetailPage from '../pages/answers-detail/AnswersDetailPageContainer';

import TopBar from '../topbar/TopBarContainer';

// const Routess = ({ history }) => (
//   <Router history={history}>
//     <IndexRoute components={{ main: LoginPage }} />
//     <Route path="dashboard">
//       <IndexRoute components={{ main: DashboardPage }} />
//       <Route path="areas" components={{ main: AreasPage }} />
//       <Route path="reports" components={{ main: ReportsPage }} />
//       <Route path="templates">
//         <IndexRoute components={{ main: QuestionairesPage }} />
//         <Route path=":reportId" components={{ main: AnswersPage }} />
//         <Route path=":reportId/:answerId" components={{ main: AnswersDetailPage }} />
//       </Route>
//     </Route>
//   </Router>
// );

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
              <Route path={`${match.url}templates`} component={QuestionairesPage}/>
            </div>
          }
          {!user.loggedIn && <Redirect to="/" />}
        </div>
      </main>
    );
  }
}

export default App;
