import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import App from './components/app/AppContainer';

// Pages
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/dashboard/DashboardPageContainer';
import AreasPage from './components/pages/areas/AreasPageContainer';
import ReportsPage from './components/pages/reports/ReportsPageContainer';
import QuestionairesPage from './components/pages/questionaires/QuestionairesPageContainer';
import AnswersPage from './components/pages/answers/AnswersPageContainer';
import AnswersDetailPage from './components/pages/answers/AnswersDetailPageContainer';


const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute components={{ main: LoginPage }} />
      <Route path="dashboard">
        <IndexRoute components={{ main: DashboardPage }} />
        <Route path="areas" components={{ main: AreasPage }} />
        <Route path="reports" components={{ main: ReportsPage }} />
        <Route path="templates">
          <IndexRoute components={{ main: QuestionairesPage }} />
          <Route path=":reportId" components={{ main: AnswersPage }} />
          <Route path=":reportId/:answerId" components={{ main: AnswersDetailPage }} />
        </Route>
      </Route>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
