import { render } from "test-utils";
import Hero from "../Hero";

it("Hero should render properly", () => {
  const { container } = render(
    <Hero
      title="areas.manageAreaName"
      titleValues={{ name: "Area" }}
      backLink={{ name: "areas.back", to: "/areas" }}
      actions={
        <a href="/" className="c-button c-button--primary">
          I am a button link
        </a>
      }
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <aside
        class="c-hero"
      >
        <div
          class="row column"
        >
          <div
            class="c-hero__content"
          >
            <a
              class="c-link c-link--hero"
              href="/areas"
            >
              <img
                alt=""
                role="presentation"
                src="ChevronRightBrandGreen.svg"
              />
              Back to Areas
            </a>
          </div>
          <div
            class="c-hero__content"
          >
            <h1
              class="u-text-700 u-text-neutral-300 u-text-capitalize u-text-ellipsis"
            >
              Manage area: Area
            </h1>
            <div
              class="c-hero__actions"
            >
              <a
                class="c-button c-button--primary"
                href="/"
              >
                I am a button link
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `);
});
