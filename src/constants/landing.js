export const LIVE_SETTINGS = `window.liveSettings = {
    picker: '#transifexTranslateElement',
    api_key: ${process.env.GFW_API_KEY},
    detectlang: false,
    site: 'gfw-watcher'};`;
export const GFW_ASSETS_PATH = process.env.GFW_ASSETS_PATH;
const TWITTER_WIDGET_API = process.env.TWITTER_WIDGET_API;
const FACEBOOK_WIDGET_API = process.env.FACEBOOK_WIDGET_API;
const GOOGLE_PLUS_ONE_WIDGET_API = process.env.GOOGLE_PLUS_ONE_WIDGET_API;
  
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
  LIVE_SETTINGS,
  GFW_ASSETS_PATH,
  SOCIAL_FOOTER_SCRIPT
};