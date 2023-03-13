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
        class="c-input c-input--toggle"
      >
        <label
          class="c-input__label"
          for="headlessui-switch-:r1:"
          id="headlessui-label-:r0:"
        >
          Hello
        </label>
        <button
          aria-checked="false"
          aria-labelledby="headlessui-label-:r0:"
          class="c-input__toggle"
          data-headlessui-state=""
          id="headlessui-switch-:r1:"
          role="switch"
          tabindex="0"
          type="button"
        >
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
        class="c-input c-input--toggle"
      >
        <label
          class="c-input__label"
          for="headlessui-switch-:r3:"
          id="headlessui-label-:r2:"
        >
          Hello
        </label>
        <button
          aria-checked="true"
          aria-labelledby="headlessui-label-:r2:"
          class="c-input__toggle c-input__toggle--on"
          data-headlessui-state="checked"
          id="headlessui-switch-:r3:"
          role="switch"
          tabindex="0"
          type="button"
        >
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
        class="c-input c-input--toggle"
      >
        <label
          class="c-input__label"
          for="headlessui-switch-:r5:"
          id="headlessui-label-:r4:"
        >
          Hello
        </label>
        <button
          aria-checked="false"
          aria-labelledby="headlessui-label-:r4:"
          class="c-input__toggle"
          data-headlessui-state=""
          id="headlessui-switch-:r5:"
          role="switch"
          tabindex="0"
          type="button"
        >
          <span
            class="c-input__toggle-indicator"
          />
        </button>
      </div>
    </div>
  `);
});
