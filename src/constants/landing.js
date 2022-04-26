import { FACEBOOK_WIDGET_API, TWITTER_WIDGET_API } from "./global";

export const GFW_ASSETS_PATH = process.env.REACT_APP_GFW_ASSETS_PATH;

export const DOWNLOAD_APK_LINK = process.env.REACT_APP_DOWNLOAD_APK_LINK;
export const DOWNLOAD_APK_VERSION = process.env.REACT_APP_DOWNLOAD_APK_VERSION;

export const SOCIAL_FOOTER_SCRIPT = `
      // Twitter
      !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="${TWITTER_WIDGET_API}";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

      // Facebook
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "${FACEBOOK_WIDGET_API}";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    `;

const Landing = {
  SOCIAL_FOOTER_SCRIPT,
  GFW_ASSETS_PATH,
  DOWNLOAD_APK_LINK
};

export default Landing;
