import { render as utilRender } from "test-utils";
import RadioChipGroup, { IProps as IRadioChipGroupProps } from "../RadioChipGroup";
import { fireEvent } from "../../../../test-utils";

const radioOptions: IRadioChipGroupProps["options"] = [
  {
    className: "my-class-name",
    value: "email",
    name: "Email"
  },
  {
    className: "my-class-name",
    value: "zip",
    name: "Zip"
  },
  {
    className: "my-class-name",
    value: "pigeon",
    name: "Pigeon"
  }
];

describe("RadioChipGroup Component", () => {
  const onChange = jest.fn();

  const render = (props?: Omit<Omit<IRadioChipGroupProps, "options">, "onChange">) =>
    utilRender(<RadioChipGroup options={radioOptions} onChange={onChange} {...props} />);

  it("should render correctly", () => {
    const { container } = render({
      className: "my-class-name"
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="my-class-name c-radio-chip-group"
          id="headlessui-radiogroup-:r0:"
          role="radiogroup"
        >
          <div
            aria-checked="true"
            class="my-class-name c-radio-chip-group__item"
            id="headlessui-radiogroup-option-:r1:"
            role="radio"
            tabindex="0"
          >
            <span
              class="c-chip c-chip--primary c-chip--is-selectable c-chip--is-selected"
            >
              Email
            </span>
          </div>
          <div
            aria-checked="false"
            class="my-class-name c-radio-chip-group__item"
            id="headlessui-radiogroup-option-:r2:"
            role="radio"
            tabindex="-1"
          >
            <span
              class="c-chip c-chip--secondary c-chip--is-selectable"
            >
              Zip
            </span>
          </div>
          <div
            aria-checked="false"
            class="my-class-name c-radio-chip-group__item"
            id="headlessui-radiogroup-option-:r3:"
            role="radio"
            tabindex="-1"
          >
            <span
              class="c-chip c-chip--secondary c-chip--is-selectable"
            >
              Pigeon
            </span>
          </div>
        </div>
      </div>
    `);
  });

  it("should render with a label", () => {
    const { container } = render({
      label: "my.label"
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          aria-labelledby="headlessui-label-:r5:"
          class="c-radio-chip-group"
          id="headlessui-radiogroup-:r4:"
          role="radiogroup"
        >
          <label
            class="c-radio-chip-group__label"
            id="headlessui-label-:r5:"
            role="none"
          >
            my.label
          </label>
          <div
            aria-checked="true"
            class="my-class-name c-radio-chip-group__item"
            id="headlessui-radiogroup-option-:r6:"
            role="radio"
            tabindex="0"
          >
            <span
              class="c-chip c-chip--primary c-chip--is-selectable c-chip--is-selected"
            >
              Email
            </span>
          </div>
          <div
            aria-checked="false"
            class="my-class-name c-radio-chip-group__item"
            id="headlessui-radiogroup-option-:r7:"
            role="radio"
            tabindex="-1"
          >
            <span
              class="c-chip c-chip--secondary c-chip--is-selectable"
            >
              Zip
            </span>
          </div>
          <div
            aria-checked="false"
            class="my-class-name c-radio-chip-group__item"
            id="headlessui-radiogroup-option-:r8:"
            role="radio"
            tabindex="-1"
          >
            <span
              class="c-chip c-chip--secondary c-chip--is-selectable"
            >
              Pigeon
            </span>
          </div>
        </div>
      </div>
    `);
  });

  it("should correctly sent the initially value", () => {
    const { getAllByRole } = render({
      value: "zip"
    });

    const zipChip = getAllByRole("radio")[1];

    expect(zipChip.attributes.getNamedItem("aria-checked")!.value).toBe("true");
  });

  it("should call onChange when radio option is changed", () => {
    const { getAllByRole } = render();

    fireEvent.click(getAllByRole("radio")[1]);

    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith("zip");
  });
});
