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
              class="c-hero__title u-text-700 u-text-neutral-300 u-text-capitalize u-text-ellipsis"
            >
              Area
            </h1>
            <div
              class="c-hero__spacer"
            >
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
        </div>
      </aside>
    </div>
  `);
});

it("Hero should render properly with Page Tabs", () => {
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
      pageTabs={{
        value: "investigation",
        options: [
          {
            value: "investigation",
            name: "reporting.tabs.investigation",
            href: "/reporting/investigation"
          },
          {
            value: "reports",
            name: "reporting.tabs.reports",
            href: "/reporting/reports"
          }
        ]
      }}
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <aside
        class="c-hero c-hero--with-tabs"
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
              class="c-hero__title u-text-700 u-text-neutral-300 u-text-capitalize u-text-ellipsis"
            >
              Area
            </h1>
            <div
              class="c-hero__page-tabs c-tab-group"
              id="headlessui-radiogroup-:r0:"
              role="radiogroup"
            >
              <div
                aria-checked="true"
                class="c-tab-group__item"
                id="headlessui-radiogroup-option-:r1:"
                role="radio"
                tabindex="0"
              >
                <a
                  href="/reporting/investigation"
                >
                  <span
                    class="c-chip c-chip--secondary-light-text c-chip--is-selectable c-chip--is-selected"
                  >
                    Investigation
                  </span>
                </a>
              </div>
              <div
                aria-checked="false"
                class="c-tab-group__item"
                id="headlessui-radiogroup-option-:r2:"
                role="radio"
                tabindex="-1"
              >
                <a
                  href="/reporting/reports"
                >
                  <span
                    class="c-chip c-chip--secondary-light-text c-chip--is-selectable"
                  >
                    Reports
                  </span>
                </a>
              </div>
            </div>
            <div
              class="c-hero__spacer"
            >
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
        </div>
      </aside>
    </div>
  `);
});
