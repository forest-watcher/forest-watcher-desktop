import { render as utilRender } from "test-utils";
import RadioChipGroup from "../RadioChipGroup";

const radioOptions = [
  {
    value: "email",
    name: "Email"
  },
  {
    value: "zip",
    name: "Zip"
  },
  {
    value: "pigeon",
    name: "Pigeon"
  }
];

describe("RadioChipGroup Component", () => {
  const onChange = jest.fn();

  const render = () => utilRender(<RadioChipGroup options={radioOptions} onChange={onChange} />);

  it("should render correctly", () => {
    const { container } = render();

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="c-radio-chip-group"
          id="headlessui-radiogroup-:r0:"
          role="radiogroup"
        >
          <div
            aria-checked="true"
            class="c-radio-chip-group__item"
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
            class="c-radio-chip-group__item"
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
            class="c-radio-chip-group__item"
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

  // it("should call onChange when radio option is changed", () => {
  //   const { container, getByText } = render();
  //
  //   const nextChip = getByText("Zip");
  // });
});
