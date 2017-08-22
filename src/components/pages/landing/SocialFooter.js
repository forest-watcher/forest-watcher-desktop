import React from 'react';

class SocialFooter extends React.Component {
  componentDidMount(){
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.async = true;
    this.script.innerHTML = `
      // Twitter
      !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

      // Facebook
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&status=0";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      // Google Plus
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    `;
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
              <a href="http://twitter.com/share" target="_blank" className="twitter-share-button" data-url="http://www.globalforestwatch.org/" data-text="Global Forest Watch">Tweet</a>
              <div className="g-plusone" data-size="medium" data-href="http://www.globalforestwatch.org/" />
              <div className="fb-like" data-href="http://www.globalforestwatch.org/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false" />
            </div>
          </div>
          <div className="small-6 columns">
            <div className="text -title-xxs -color-5">Sign up to receive updates</div>
            <div className="c-social__icons">
              <a href="?show_newsletter=true" title="Receive Global Forest Watch updates" onclick="ga('send', 'event', 'Footer', 'Click', 'Subscribe');">
                <svg className="icon">
                  <use xlinkHref="#icon-mail" />
                </svg>
              </a>
              <a href="https://twitter.com/globalforests" title="Follow @globalforests" target="_blank" onclick="ga('send', 'event', 'Footer', 'Click', 'Twitter');">
                <svg className="icon">
                  <use xlinkHref="#icon-twitter" />
                </svg>
              </a>
              <a href="http://instagram.com/globalforests" title="Follow @globalforests Instagram" target="_blank" onclick="ga('send', 'event', 'Footer', 'Click', 'Instagram');">
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
