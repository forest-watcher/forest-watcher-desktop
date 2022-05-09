import "../src/index.scss";
import { DEFAULT_LANGUAGE } from "constants/global";
import { IntlProvider } from "react-intl";
import translations from "locales/index.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <IntlProvider locale={DEFAULT_LANGUAGE} messages={translations[DEFAULT_LANGUAGE]}>
      <Story />
    </IntlProvider>
  ),
];