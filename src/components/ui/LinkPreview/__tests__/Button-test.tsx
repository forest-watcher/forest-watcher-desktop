import { render } from "test-utils";
import LinkPreview from "../LinkPreview";

it("Button should render properly", () => {
  const { container } = render(
    <LinkPreview btnCaption="Copy link" link="google.com">
      google.com
    </LinkPreview>
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-link-preview"
      >
        <div
          class="c-link-preview__children u-flex-1"
        >
          google.com
        </div>
        <span
          class="c-chip c-chip--secondary c-link-preview__cta"
        >
          Copy link
        </span>
      </div>
    </div>
  `);
});
