import "../src/index.scss";
import "../src/main.css";
import { DEFAULT_LANGUAGE } from "constants/global";
import { IntlProvider } from "react-intl";
import translations from "locales/index.js";
import store from "store";
import { Provider } from "react-redux";
import "configureYup";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

export const decorators = [
  Story => {
    return (
      <Provider store={store}>
        <IntlProvider locale={DEFAULT_LANGUAGE} messages={translations[DEFAULT_LANGUAGE]}>
          <Story />
        </IntlProvider>
      </Provider>
    );
  }
];
