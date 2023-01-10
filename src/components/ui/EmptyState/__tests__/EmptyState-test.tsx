import { render } from "test-utils";
import EmptyState from "../EmptyState";
import PeopleIcon from "assets/images/icons/People.svg";

it("EmptyState should render properly", () => {
  const { container } = render(
    <EmptyState
      iconUrl={PeopleIcon}
      title="No Teams Added"
      text="Create an area to start assigning teams"
      ctaText="Create Area"
      ctaTo="/"
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-empty-state"
      >
        <img
          alt=""
          class="c-empty-state__icon"
          role="presentation"
          src="People.svg"
        />
        <h2
          class="c-empty-state__title"
        >
          No Teams Added
        </h2>
        <p
          class="c-empty-state__text"
        >
          Create an area to start assigning teams
        </p>
        <a
          class="c-button c-button--primary c-empty-state__cta"
          href="/"
        >
          Create Area
        </a>
      </div>
    </div>
  `);
});
