import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Banner from "./Banner";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("Banner", () => {
  it("can render", () => {
    act(() => {
      ReactDOM.render(<Banner title={"test title"} />, container);
    });
    const title = container.querySelector(".test-banner-title");

    expect(title.textContent).toBe("test title");
  });
});
