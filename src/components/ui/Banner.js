import React, { PureComponent } from 'react';
import Icon from './Icon';
import PropTypes from 'prop-types';

class Banner extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render() {
    const { title } = this.props;
    return (
      <div className="c-banner c-banner--info">
        <Icon className="-small u-margin-right-small" name="icon-info"/>
        <span className="test-banner-title">{title}</span>
      </div>
    );
  }
}

export default Banner;
