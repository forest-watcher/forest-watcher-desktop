import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function Article(props) {
  return (
    <article className="c-article row column">
      {props.title && <h2 className="text -small-title"><FormattedMessage id={props.title} /></h2>}
      {props.children}
    </article>
  );
}

Article.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default Article;