import { render } from "test-utils";
import Card from "../Card";

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
    <Card size="large" as="a" href="/foo">
      <Card.Image alt="Placeholder picture" src="https://picsum.photos/200" />
      <Card.Title>Area with a load of text</Card.Title>
      <Card.Text>Some text</Card.Text>
      <Card.Cta>Manage</Card.Cta>
    </Card>
  );
  expect(container).toMatchInlineSnapshot(`
    <div>
      <a
        class="c-card c-card--large"
        data-testid="card"
        href="/foo"
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
        <p
          class="c-card__cta"
        >
          <span>
            Manage
          </span>
        </p>
      </a>
    </div>
  `);
});
