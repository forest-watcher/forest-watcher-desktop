import { render } from "test-utils";
import Chip from "../Chip";

it("Chip should render properly", () => {
  const { container } = render(<Chip>Click me</Chip>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="c-chip c-chip--primary"
      >
        Click me
      </span>
    </div>
  `);
});

it("Chip primary should render properly", () => {
  const { container } = render(<Chip variant="primary">Click me</Chip>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="c-chip c-chip--primary"
      >
        Click me
      </span>
    </div>
  `);
});

it("Chip secondary should render properly", () => {
  const { container } = render(<Chip variant="secondary">Click me</Chip>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="c-chip c-chip--secondary"
      >
        Click me
      </span>
    </div>
  `);
});

it("Chip selectable should render properly", () => {
  const { container } = render(
    <Chip variant="primary" isSelectable>
      Click me
    </Chip>
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="c-chip c-chip--primary c-chip--is-selectable"
      >
        Click me
      </span>
    </div>
  `);
});
