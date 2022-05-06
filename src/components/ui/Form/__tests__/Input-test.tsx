import { useForm } from "react-hook-form";
import { render } from "test-utils";
import Input from "../Input";

const UseFormWrapper = (args: any) => {
  const { register } = useForm();
  return <Input {...args} registered={register("exampleInput")} />;
};

it("Text Input should render correctly", () => {
  const { container } = render(
    <UseFormWrapper
      id="text-input"
      htmlInputProps={{
        type: "text",
        placeholder: "Enter text",
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
          class="c-input__label c-input__label--text"
          for="text-input"
        >
          Hello
        </label>
        <div
          class="c-input__input-wrapper"
        >
          <input
            aria-errormessage="text-input-error"
            aria-invalid="false"
            class="c-input__input c-input__input--text"
            id="text-input"
            label="Hello"
            name="exampleInput"
            placeholder="Enter text"
            type="text"
          />
        </div>
      </div>
    </div>
  `);
});

it("Text Input with an error should render correctly", () => {
  const { container } = render(
    <UseFormWrapper
      id="text-input"
      htmlInputProps={{
        type: "text",
        placeholder: "Enter text",
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
          class="c-input__label c-input__label--text"
          for="text-input"
        >
          Hello
        </label>
        <div
          class="c-input__input-wrapper"
        >
          <input
            aria-errormessage="text-input-error"
            aria-invalid="true"
            class="c-input__input c-input__input--text c-input__input--error"
            id="text-input"
            label="Hello"
            name="exampleInput"
            placeholder="Enter text"
            type="text"
          />
          <img
            alt=""
            class="c-input__error-icon"
            role="presentation"
            src="Error.svg"
          />
          <div
            class="c-input__error-message"
            id="text-input-error"
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
