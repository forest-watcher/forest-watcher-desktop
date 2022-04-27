import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Walkthough from "./Walkthrough";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("Walkthough Dialog", () => {
  it("can render", () => {
    act(() => {
      ReactDOM.render(
        <Walkthough
          title="title text"
          intro="intro text"
          steps={[
            { content: "Content 1." },
            { content: "Content 2" },
            { content: "Content 3", childContent: "Child content" },
            { content: "Content 4" }
          ]}
        />,
        container
      );
    });

    const title = container.querySelector(".test-walkthough-title");
    const intro = container.querySelector(".test-walkthough-intro");

    expect(title.textContent).toBe("title text");
    expect(intro.textContent).toBe("intro text");
  });

  it("can render all steps", () => {
    act(() => {
      ReactDOM.render(
        <Walkthough
          title="title text"
          intro="intro text"
          steps={[
            { content: "Content 1." },
            { content: "Content 2" },
            { content: "Content 3", childContent: "Child content" },
            { content: "Content 4" }
          ]}
        />,
        container
      );
    });

    const steps = container.querySelectorAll(".test-walkthough-steps");

    expect(steps.length).toBe(4);
  });

  it("should update the currentStep content", () => {
    act(() => {
      ReactDOM.render(
        <Walkthough
          title="title text"
          intro="intro text"
          steps={[
            { content: "Content 1." },
            { content: "Content 2" },
            { content: "Content 3", childContent: "Child content" },
            { content: "Content 4" }
          ]}
        />,
        container
      );
    });

    const step = container.querySelector(".test-current-step");
    const stepButtonOne = container.querySelectorAll(".test-step-button")[1];
    const stepButtonTwo = container.querySelectorAll(".test-step-button")[2];

    act(() => {
      stepButtonOne.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(step.textContent).toBe("Content 2");

    act(() => {
      stepButtonTwo.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(step.textContent).toBe("Content 3");
  });

  it("should render the current steps child content", () => {
    act(() => {
      ReactDOM.render(
        <Walkthough
          title="title text"
          intro="intro text"
          steps={[
            { content: "Content 1." },
            { content: "Content 2" },
            { content: "Content 3", childContent: "Child content" },
            { content: "Content 4" }
          ]}
        />,
        container
      );
    });

    const stepButton = container.querySelectorAll(".test-step-button")[2];

    act(() => {
      stepButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const step = container.querySelector(".test-current-step");
    const stepChild = container.querySelector(".test-current-step-child");

    expect(step.textContent).toBe("Content 3");
    expect(stepChild.textContent).toBe("Child content");
  });

  it("calls the onAccept function", () => {
    const mock = jest.fn();
    act(() => {
      ReactDOM.render(
        <Walkthough
          onAccept={mock}
          title="title text"
          intro="intro text"
          steps={[
            { content: "Content 1." },
            { content: "Content 2" },
            { content: "Content 3", childContent: "Child content" },
            { content: "Content 4" }
          ]}
        />,
        container
      );
    });
    const confirmBtn = container.querySelector(".test-confirm-button");
    act(() => {
      confirmBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mock.mock.calls.length).toBe(1);
  });
});
