import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'query-string';

class Dashboard extends React.Component {

  componentWillMount() {
    this.trimQueryParams();
    this.props.getUserAreas();
  }

  trimQueryParams() {
    const { location, history } = this.props;
    const search = location.search || '';
    const queryParams = querystring.parse(search);
    if (queryParams.token) {
      const newSearch = querystring.stringify({ ...queryParams, token: undefined });
      history.replace('/dashboard', { search: newSearch });
    }
  }

  render() {
    return (
      <div>
        Welcome to Forest Watcher 2.0. You are logged in.
      </div>
    );
  }
}

Dashboard.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getUserAreas: PropTypes.func.isRequired
};

export default Dashboard;
