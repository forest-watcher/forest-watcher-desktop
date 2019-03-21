import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ShapefileInfo extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    maxSize: PropTypes.string.isRequired,
    formats: PropTypes.string.isRequired,
    unzippedTitle: PropTypes.string.isRequired,
    unzipped: PropTypes.string.isRequired,
    zippedTitle: PropTypes.string.isRequired,
    zipped: PropTypes.string.isRequired,
    onAccept: PropTypes.func
  };

  onAccept = (e) => {
    e.preventDefault();
    const { onAccept } = this.props;
    if (onAccept) onAccept();
  }

  render() {
    const { title, maxSize, formats, unzippedTitle, unzipped, zippedTitle, zipped } = this.props;
    return (
      <div className="c-walkthrough">
        <div className="walkthrough-content">
          <h2 className="text -small-title -green">{title}</h2>
          <p className="text">{maxSize}</p>
          <p className="text">{formats}</p>

          <ul className="walkthrough-steps-content">
            <li className="walkthrough-steps-content-item text">
              <p className="text"><span className="u-bold">{unzippedTitle}</span> {unzipped}</p>
            </li>
            <li className="walkthrough-steps-content-item text">
              <p className="text"><span className="u-bold">{zippedTitle}</span> {zipped}</p>
            </li>
          </ul>

          <div className="walkthrough-action">
            <button className="c-button" onClick={this.onAccept}>ok</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ShapefileInfo;
