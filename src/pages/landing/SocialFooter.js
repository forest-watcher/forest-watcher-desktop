import React from 'react';
import { SOCIAL_FOOTER_SCRIPT } from '../../constants/landing';

class SocialFooter extends React.Component {
  componentDidMount(){
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.async = true;
    this.script.innerHTML = SOCIAL_FOOTER_SCRIPT;
    document.body.appendChild(this.script);
  }

  componentWillUnmount(){
    document.body.removeChild(this.script);
  }

  render() {
    return (
      <div className="c-social">
        <div className="row">
          <div className="small-6 columns">
            <div className="text -title-xxs -color-5">Spread the word</div>
            <div className="c-social__buttons">
              <div id="fb-root" />
              <a href="http://twitter.com/share" rel="noreferrer noopener" target="_blank" className="twitter-share-button" data-url="http://www.globalforestwatch.org/" data-text="Global Forest Watch">Tweet</a>
              <div className="fb-like" data-href="http://www.globalforestwatch.org/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false" />
            </div>
          </div>
          <div className="small-6 columns">
            <div className="text -title-xxs -color-5">Sign up to receive updates</div>
            <div className="c-social__icons">
              <a href="?show_newsletter=true" title="Receive Global Forest Watch updates" >
                <svg className="icon">
                  <use xlinkHref="#icon-mail" />
                </svg>
              </a>
              <a href="https://twitter.com/globalforests" rel="noreferrer noopener" title="Follow @globalforests" target="_blank">
                <svg className="icon">
                  <use xlinkHref="#icon-twitter" />
                </svg>
              </a>
              <a href="http://instagram.com/globalforests" rel="noreferrer noopener" title="Follow @globalforests Instagram" target="_blank">
                <svg className="icon">
                  <use xlinkHref="#icon-instagram" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SocialFooter;
