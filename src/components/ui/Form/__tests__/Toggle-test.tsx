import { useForm } from "react-hook-form";
import { render } from "test-utils";
import Toggle from "../Toggle";

const UseFormWrapper = (args: any) => {
  const formHook = useForm();
  const { register } = formHook;
  return <Toggle {...args} registered={register("exampleInput")} formHook={formHook} />;
};

it("Toggle Input should render correctly unspecified", () => {
  const { container } = render(
    <UseFormWrapper
      id="toggle-input"
      toggleProps={{
        label: "Hello"
      }}
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-input"
      >
        <button
          class="c-input__toggle"
          id="headlessui-switch-:r0:"
          role="switch"
          tabindex="0"
          type="button"
        >
          <span
            class="u-visually-hidden"
          >
            Hello
          </span>
          <span
            class="c-input__toggle-indicator"
          />
        </button>
      </div>
    </div>
  `);
});

it("Toggle Input should render correctly as true", () => {
  const { container } = render(
    <UseFormWrapper
      id="toggle-input"
      toggleProps={{
        label: "Hello",
        defaultValue: true
      }}
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-input"
      >
        <button
          aria-checked="true"
          class="c-input__toggle c-input__toggle--on"
          id="headlessui-switch-:r1:"
          role="switch"
          tabindex="0"
          type="button"
        >
          <span
            class="u-visually-hidden"
          >
            Hello
          </span>
          <span
            class="c-input__toggle-indicator"
          />
        </button>
      </div>
    </div>
  `);
});

it("Toggle Input should render correctly as false", () => {
  const { container } = render(
    <UseFormWrapper
      id="toggle-input"
      toggleProps={{
        label: "Hello",
        defaultValue: false
      }}
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-input"
      >
        <button
          aria-checked="false"
          class="c-input__toggle"
          id="headlessui-switch-:r2:"
          role="switch"
          tabindex="0"
          type="button"
        >
          <span
            class="u-visually-hidden"
          >
            Hello
          </span>
          <span
            class="c-input__toggle-indicator"
          />
        </button>
      </div>
    </div>
  `);
});
