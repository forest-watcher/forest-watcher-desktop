// test-utils.js
import { FC } from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { BrowserRouter as Router } from "react-router-dom";

interface WrapperProps {
  children?: React.ReactNode;
}

function render(ui: JSX.Element, { storeConfig = configureStore(), ...renderOptions } = {}) {
  const Wrapper: FC<WrapperProps> = ({ children }) => {
    return (
      <Provider store={storeConfig}>
        <Router>{children}</Router>
      </Provider>
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
