import { PureComponent } from "react";
import PropTypes from "prop-types";

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

  onAccept = e => {
    e.preventDefault();
    const { onAccept } = this.props;
    if (onAccept) onAccept();
  };

  render() {
    const { title, maxSize, formats, unzippedTitle, unzipped, zippedTitle, zipped } = this.props;
    return (
      <div className="c-modal-content">
        <div className="modal-content-inner">
          <h2 className="modal-content-header u-padding-bottom-small u-margin-bottom text -small-title -green">
            {title}
          </h2>
          <p className="text test-max-size u-padding-bottom-small">{maxSize}</p>
          <p className="text test-formats u-padding-bottom-small">{formats}</p>

          <ul className="modal-content-steps-content">
            <li className="modal-content-steps-content-item text">
              <p className="text test-unzipped">
                <span className="u-bold test-unzipped-title">{unzippedTitle}</span> {unzipped}
              </p>
            </li>
            <li className="modal-content-steps-content-item text">
              <p className="text test-zipped">
                <span className="u-bold test-zipped-title">{zippedTitle}</span> {zipped}
              </p>
            </li>
          </ul>

          <div className="modal-content-action u-margin-top-large">
            <button className="c-button test-confirm-button u-text-center" onClick={this.onAccept}>
              ok
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ShapefileInfo;
