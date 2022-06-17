import { render as utilRender, fireEvent } from "test-utils";
import TabGroup, { IProps as ITabGroupProps } from "./TabGroup";
import { Switch, Route, Redirect } from "react-router-dom";

const tabOptions: ITabGroupProps["options"] = [
  {
    className: "my-class-name",
    value: "foo",
    name: "Foo",
    href: "/foo"
  },
  {
    className: "my-class-name",
    value: "bar",
    name: "bar",
    href: "/bar"
  }
];

describe("TabGroup Component", () => {
  const render = (props?: Omit<Omit<ITabGroupProps, "options">, "value">) =>
    utilRender(
      <Switch>
        <Redirect exact from="/" to="/foo" />
        <Route
          exact
          path="/:tab"
          render={({ match: { params } }) => <TabGroup value={params.tab} options={tabOptions} {...props} />}
        />
      </Switch>
    );

  it("should render correctly", () => {
    const { container } = render({
      className: "my-class-name"
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="my-class-name c-tab-group"
          id="headlessui-radiogroup-:r0:"
          role="radiogroup"
        >
          <div
            aria-checked="true"
            class="my-class-name c-tab-group__item"
            id="headlessui-radiogroup-option-:r1:"
            role="radio"
            tabindex="0"
          >
            <a
              href="/foo"
            >
              <span
                class="c-chip c-chip--secondary-light-text c-chip--is-selectable c-chip--is-selected"
              >
                Foo
              </span>
            </a>
          </div>
          <div
            aria-checked="false"
            class="my-class-name c-tab-group__item"
            id="headlessui-radiogroup-option-:r2:"
            role="radio"
            tabindex="-1"
          >
            <a
              href="/bar"
            >
              <span
                class="c-chip c-chip--secondary-light-text c-chip--is-selectable"
              >
                bar
              </span>
            </a>
          </div>
        </div>
      </div>
    `);
  });

  it("should activate the correct tab when the route is changed", () => {
    const { container, getByText } = render();

    const barTab = getByText("bar").parentElement!;

    fireEvent.click(barTab);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="c-tab-group"
          id="headlessui-radiogroup-:r3:"
          role="radiogroup"
        >
          <div
            aria-checked="false"
            class="my-class-name c-tab-group__item"
            id="headlessui-radiogroup-option-:r4:"
            role="radio"
            tabindex="-1"
          >
            <a
              href="/foo"
            >
              <span
                class="c-chip c-chip--secondary-light-text c-chip--is-selectable"
              >
                Foo
              </span>
            </a>
          </div>
          <div
            aria-checked="true"
            class="my-class-name c-tab-group__item"
            id="headlessui-radiogroup-option-:r5:"
            role="radio"
            tabindex="0"
          >
            <a
              href="/bar"
            >
              <span
                class="c-chip c-chip--secondary-light-text c-chip--is-selectable c-chip--is-selected"
              >
                bar
              </span>
            </a>
          </div>
        </div>
      </div>
    `);
  });
});
