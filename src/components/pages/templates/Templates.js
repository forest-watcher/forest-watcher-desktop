import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
// import Filters from './TemplateFiltersContainer';
import Loader from '../../ui/Loader';
import { injectIntl } from 'react-intl';

class Templates extends React.Component {

  createTemplate = () => {
    const { history } = this.props;
    history.push('/templates/create');
  }

  render() {
    const { templates } = this.props;
    const columns = [{
      Header: <FormattedMessage id="templates.title" />,
      accessor: 'title'
    },{
      Header: <FormattedMessage id="reports.areaOfInterest" />,
      accessor: 'areaOfInterest'
    },{  
      Header: <FormattedMessage id="templates.defaultLanguage" />,
      accessor: 'date'
    },{
      Header: <FormattedMessage id="templates.status" />,
      accessor: 'member'
    },{
      Header: <FormattedMessage id="templates.reportsSubmitted" />,
      accessor: 'number'
    }];
    return (
      <div>
        <Hero
          title="templates.title"
          action={{name: "templates.create", callback: this.createTemplate}}
        />
          <div className="l-content">
            <Article>
              {/*<Filters
                answers={answers}
                areasOptions={this.props.areasOptions}
                templateOptions={this.props.templateOptions}
              />*/}
              <div className="l-loader">
                <ReactTable
                  className="c-table"
                  data={templates || []}
                  columns={columns}
                  showPageSizeOptions={false}
                  minRows={5}
                  noDataText={this.props.intl.formatMessage({ id: 'templates.noTemplatesFound' })}
                />
                <Loader isLoading={this.props.loading} />
              </div>
            </Article>
          </div>
      </div>
    );
  }
}

Templates.propTypes = {
  intl: PropTypes.object,
  loading: PropTypes.bool
};

export default injectIntl(Templates);
