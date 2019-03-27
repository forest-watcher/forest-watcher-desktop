import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Walkthrough extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired,
    steps: PropTypes.array,
    onAccept: PropTypes.func
  };

  state = {
    currentStep: 0
  }

  setCurrentStep = (e, currentStep) => {
    e.preventDefault();
    this.setState({ currentStep });
  }

  onAccept = (e) => {
    e.preventDefault();
    const { onAccept } = this.props;
    if (onAccept) onAccept();
  }

  render() {
    const { title, intro, steps } = this.props;
    const { currentStep } = this.state;
    const content = steps[currentStep].content;
    const childContent = steps[currentStep].childContent;
    return (
      <div className="c-modal-content">
        <div className="modal-content-inner">
          <h2 className="text -small-title -green test-walkthough-title">{title}</h2>
          <p className="text test-walkthough-intro">{intro}</p>
          <ol className="modal-content-steps-index test-walkthough-step-number">
            {
              steps.map((step, index) => (
                <li
                  key={`step-index-${index}`}
                  className={cx(['modal-content-steps-index-item', 'text', '-question-number', 'test-walkthough-steps', { '-active': index === currentStep }])}
                >
                  <button onClick={(e) => this.setCurrentStep(e, index)} className="test-step-button">
                    {`0${index + 1}.`}
                  </button>
                </li>
              ))
            }
          </ol>
          <ul className="modal-content-steps-content">
            <li className="modal-content-steps-content-item text test-current-step">
              {content}
            </li>
            {childContent &&
              <ul>
                <li className="text">
                  {childContent}
                </li>
              </ul>
            }
          </ul>
          <div className="modal-content-action">
            <button className="c-button test-confirm-button" onClick={this.onAccept}>ok</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Walkthrough;
