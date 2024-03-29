// test-utils.js
import { FC } from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DEFAULT_LANGUAGE } from "constants/global";
import { IntlProvider } from "react-intl";
import translations from "locales/index.js";
import store from "./store";

interface WrapperProps {
  children?: React.ReactNode;
}

function render(ui: JSX.Element, { storeConfig = store, ...renderOptions } = {}) {
  const Wrapper: FC<WrapperProps> = ({ children }) => {
    return (
      <IntlProvider
        locale={DEFAULT_LANGUAGE}
        // @ts-ignore
        messages={translations[DEFAULT_LANGUAGE]}
        onError={err => {
          // Hide missing translations on test
          if (err.code === "MISSING_TRANSLATION") {
            return;
          }
          throw err;
        }}
      >
        <Provider store={storeConfig}>
          <Router>{children}</Router>
        </Provider>
      </IntlProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };

export const routeComponentPropsMock = {
  history: {} as any,
  location: {} as any,
  match: {} as any
};
