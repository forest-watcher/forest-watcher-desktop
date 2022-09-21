import { render, fireEvent } from "test-utils";
import Button from "../Button";

it("Button should render properly", () => {
  const { container } = render(<Button>Click me</Button>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="c-button c-button--primary"
        data-testid="button"
      >
        Click me
      </button>
    </div>
  `);
});

it("Button primary should render properly", () => {
  const { container } = render(<Button variant="primary">Click me</Button>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="c-button c-button--primary"
        data-testid="button"
      >
        Click me
      </button>
    </div>
  `);
});

it("Button secondary should render properly", () => {
  const { container } = render(<Button variant="secondary">Click me</Button>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="c-button c-button--secondary"
        data-testid="button"
      >
        Click me
      </button>
    </div>
  `);
});

it("Button Clicks Correctly", async () => {
  const mockFunc = jest.fn();

  const { getByTestId } = render(
    <Button variant="primary" onClick={mockFunc}>
      Click me
    </Button>
  );
  fireEvent.click(getByTestId("button"));

  expect(mockFunc.mock.calls.length).toBe(1);
});
