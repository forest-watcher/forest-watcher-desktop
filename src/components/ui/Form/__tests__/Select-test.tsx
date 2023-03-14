import { useForm } from "react-hook-form";
import { render } from "test-utils";
import Select from "../Select";
import { Option } from "types/select";

const options: Option[] = [
  {
    label: "Cat",
    value: "cat"
  },
  {
    label: "Dog",
    value: "dog"
  },
  {
    label: "Hamster",
    value: "hamster"
  },
  {
    label: "Panda",
    value: "panda"
  }
];

const UseFormWrapper = (args: any) => {
  const formHook = useForm();
  const { register } = formHook;
  return <Select {...args} registered={register("exampleInput")} formHook={formHook} />;
};

it("Select Input should render correctly", () => {
  const { container } = render(
    <UseFormWrapper
      id="select-input"
      selectProps={{
        placeholder: "Select something",
        options,
        label: "Hello"
      }}
      onChange={() => {}}
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-input"
      >
        <label
          class="c-input__label c-input__label--select"
          data-headlessui-state=""
          id="headlessui-listbox-label-:r0:"
        >
          Hello
        </label>
        <div
          class="c-input__input-wrapper"
        >
          <div
            class="c-input__select"
          >
            <button
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="headlessui-listbox-label-:r0: headlessui-listbox-button-:r1:"
              class="c-input__select-button c-input__select-button--has-placeholder"
              data-headlessui-state=""
              id="headlessui-listbox-button-:r1:"
              type="button"
            >
              <span
                class="c-input__select-value"
              >
                Select something
              </span>
              <svg
                aria-hidden="true"
                class="c-input__select-indicator"
                fill="none"
                height="17"
                viewBox="0 0 17 17"
                width="17"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.49984 9.84808L13.3364 4.75146L14.8332 6.07662L8.49984 12.7515L2.1665 6.07662L3.66327 4.75146L8.49984 9.84808Z"
                  fill="#94BE43"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
});

it("Select Input with an error should render correctly", () => {
  const { container } = render(
    <UseFormWrapper
      id="select-input"
      selectProps={{
        placeholder: "Select something",
        options,
        label: "Hello"
      }}
      onChange={() => {}}
      error={{
        message: "This is required"
      }}
    />
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-input"
      >
        <label
          class="c-input__label c-input__label--select"
          data-headlessui-state=""
          id="headlessui-listbox-label-:r3:"
        >
          Hello
        </label>
        <div
          class="c-input__input-wrapper"
        >
          <div
            class="c-input__select c-input__select--error"
          >
            <button
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="headlessui-listbox-label-:r3: headlessui-listbox-button-:r4:"
              class="c-input__select-button c-input__select-button--has-placeholder c-input__select-button--invalid"
              data-headlessui-state=""
              id="headlessui-listbox-button-:r4:"
              type="button"
            >
              <span
                class="c-input__select-value"
              >
                Select something
              </span>
              <img
                alt=""
                class="c-input__select-error-icon"
                role="presentation"
                src="Error.svg"
              />
            </button>
          </div>
          <div
            class="c-input__error-message"
            id="select-input-error"
            role="alert"
          >
            <span>
              This is required
            </span>
          </div>
        </div>
      </div>
    </div>
  `);
});
