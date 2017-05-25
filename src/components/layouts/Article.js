import React from 'react';
import PropTypes from 'prop-types';

function Article(props) {
  return (
    <article className="c-article row column">
      {props.title && <h2 className="text -small-title">{props.title}</h2>}
      {props.children}
    </article>
  );
}

Article.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default Article;