import { Component } from "react";
import PropTypes from "prop-types";

import Hero from "components/layouts/Hero/Hero";
import Article from "../../components/layouts/Article";
import ReactTable from "react-table";
import { FormattedMessage } from "react-intl";
import TemplatesFilters from "./TemplatesFiltersContainer";
import Loader from "../../components/ui/Loader";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import qs from "query-string";
import { TABLE_PAGE_SIZE } from "../../constants/global";
import { CATEGORY, ACTION } from "../../constants/analytics";
import ReactGA from "react-ga";

class Templates extends Component {
  createTemplate = () => {
    ReactGA.event({
      category: CATEGORY.TEMPLATES,
      action: ACTION.NEW_TEMPLATE
    });
  };

  handlePageChange = page => {
    const searchParams = Object.assign(this.props.searchParams, { page: page + 1 || undefined });
    this.props.history.push({
      pathname: `/templates`,
      search: qs.stringify(searchParams)
    });
  };

  render() {
    const { templates, searchParams } = this.props;
    const columns = [
      {
        Header: <FormattedMessage id="templates.title" />,
        accessor: "title",
        Cell: props => (
          <Link className="table-link -row text" to={`/templates/${props.original.id}`}>
            <span className="link">{props.value}</span>
            <svg className="c-icon -x-small -green -no-margin">
              <use xlinkHref="#icon-arrow-link"></use>
            </svg>
          </Link>
        )
      },
      {
        Header: <FormattedMessage id="reports.areaOfInterest" />,
        accessor: "aoiName"
      },
      {
        Header: <FormattedMessage id="templates.defaultLanguage" />,
        accessor: "defaultLanguageName"
      },
      {
        Header: <FormattedMessage id="templates.status" />,
        accessor: "status",
        className: "status"
      },
      {
        Header: <FormattedMessage id="templates.reportsSubmitted" />,
        accessor: "count",
        className: "report-link",
        Cell: props => (
          <Link className="text -x-small-title" to={`/reporting/reports?defaultTemplateFilter=${props.row.title}`}>
            <span>{props.value}</span>
            <span className="link text -x-small-title">
              {this.props.intl.formatMessage({ id: "templates.showReports" })}
            </span>
          </Link>
        )
      }
    ];
    const isLoading = this.props.loadingTemplates || this.props.loadingReports;
    return (
      <div>
        <Hero
          title="templates.title"
          actions={
            <Link onClick={this.createTemplate} to="/templates/create" className="c-button c-button--primary">
              <FormattedMessage id="templates.create" />
            </Link>
          }
        />
        <div className="l-content">
          <Article>
            <TemplatesFilters areasOptions={this.props.areasOptions} />
            <div className="l-loader">
              <ReactTable
                className="c-table"
                data={!isLoading && templates ? templates : []}
                columns={columns}
                showPageSizeOptions={false}
                showPagination={templates.length > TABLE_PAGE_SIZE}
                minRows={TABLE_PAGE_SIZE}
                page={parseInt(searchParams.page, 10) - 1 || 0}
                defaultPageSize={TABLE_PAGE_SIZE}
                noDataText={this.props.intl.formatMessage({ id: "templates.noTemplatesFound" })}
                previousText=""
                nextText=""
                pageText=""
                loadingText=""
                onPageChange={page => {
                  this.handlePageChange(page);
                }}
              />
              <Loader isLoading={isLoading} />
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
