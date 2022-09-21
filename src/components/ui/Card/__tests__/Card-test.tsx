import { render } from "test-utils";
import Card from "../Card";
import { LinkProps } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  Link: function Link({ to, children, ...rest }: LinkProps) {
    return (
      <a href={to.toString()} {...rest}>
        {children}
      </a>
    );
  }
}));

it("Card should render correctly", () => {
  const { container } = render(<Card>I'm a card</Card>);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-card c-card--large"
        data-testid="card"
      >
        I'm a card
      </div>
    </div>
  `);
});

it("Small Card should render correctly", () => {
  const { container } = render(
    <Card size="small">
      <Card.Image alt="Placeholder picture" src="https://picsum.photos/200" />
      <Card.Title>Area with a load of text</Card.Title>
      <Card.Text>Some text</Card.Text>
    </Card>
  );
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-card c-card--small"
        data-testid="card"
      >
        <img
          alt="Placeholder picture"
          class="c-card__image"
          src="https://picsum.photos/200"
        />
        <h2
          class="c-card__title"
        >
          Area with a load of text
        </h2>
        <p
          class="c-card__text"
        >
          Some text
        </p>
      </div>
    </div>
  `);
});

it("Large Link Card should render correctly", () => {
  const { container } = render(
    <Card size="large">
      <Card.Image alt="Placeholder picture" src="https://picsum.photos/200" />
      <Card.Title>Area with a load of text</Card.Title>
      <Card.Text>Some text</Card.Text>
      <Card.Cta to="/foo">Manage</Card.Cta>
    </Card>
  );
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-card c-card--large"
        data-testid="card"
      >
        <img
          alt="Placeholder picture"
          class="c-card__image"
          src="https://picsum.photos/200"
        />
        <h2
          class="c-card__title"
        >
          Area with a load of text
        </h2>
        <p
          class="c-card__text"
        >
          Some text
        </p>
        <a
          class="c-card__cta"
          href="/foo"
        >
          <span>
            Manage
          </span>
        </a>
      </div>
    </div>
  `);
});

it("Nested Card should render correctly", () => {
  const { container } = render(
    <Card size="large">
      <Card.Title>Area with a load of text</Card.Title>
      <Card.Text>Some text</Card.Text>
      <Card.Cta to="/foo">Manage</Card.Cta>

      <Card size="large">
        <Card.Title>Area with a load of text</Card.Title>
        <Card.Text>Some text</Card.Text>
        <Card.Cta to="/foo">Manage</Card.Cta>
      </Card>
    </Card>
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-card c-card--large"
        data-testid="card"
      >
        <h2
          class="c-card__title"
        >
          Area with a load of text
        </h2>
        <p
          class="c-card__text"
        >
          Some text
        </p>
        <a
          class="c-card__cta"
          href="/foo"
        >
          <span>
            Manage
          </span>
        </a>
        <div
          class="c-card c-card--large"
          data-testid="card"
        >
          <h2
            class="c-card__title"
          >
            Area with a load of text
          </h2>
          <p
            class="c-card__text"
          >
            Some text
          </p>
          <a
            class="c-card__cta"
            href="/foo"
          >
            <span>
              Manage
            </span>
          </a>
        </div>
      </div>
    </div>
  `);
});
