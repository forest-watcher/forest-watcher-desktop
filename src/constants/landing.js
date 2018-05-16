import { FACEBOOK_WIDGET_API, GOOGLE_PLUS_ONE_WIDGET_API, TWITTER_WIDGET_API } from './global';

export const GFW_ASSETS_PATH = process.env.REACT_APP_GFW_ASSETS_PATH;

export const DOWNLOAD_APK_LINK = "https://rink.hockeyapp.net/api/2/apps/2394979ddd9d415c9b0e466656757d5d/app_versions/9?format=apk&avtoken=510e2758876fcd8bbd275f0eff3ff33bb3e36984&mctoken=18aa5ac7b7a92bf4840c3eb4ef096d054bdff8c8"

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

      // Google Plus
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = '${GOOGLE_PLUS_ONE_WIDGET_API}';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    `;

export default {
  SOCIAL_FOOTER_SCRIPT,
  GFW_ASSETS_PATH,
  DOWNLOAD_APK_LINK
};
