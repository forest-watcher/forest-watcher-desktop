import { render } from "test-utils";
import Pagination from "../Pagination";
// Todo - test functionality of pagination
it("Pagination should render properly", () => {
  const { container } = render(<Pagination min={1} max={3} />);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="c-pagination"
      >
        <button
          aria-label="Previous Page"
          class="c-button c-button--primary c-button--is-icon"
          data-testid="button"
          disabled=""
        >
          <img
            alt=""
            role="presentation"
            src="ChevronLeft.svg"
          />
        </button>
        <div
          class="c-pagination__input-wrapper"
        >
          <form>
            <div
              class="c-input c-pagination__input"
            >
              <label
                class="c-input__label c-input__label--text u-visually-hidden"
                for="pagination"
              >
                Pagination
              </label>
              <div
                class="c-input__input-wrapper"
              >
                <input
                  aria-errormessage="pagination-error"
                  aria-invalid="false"
                  class="c-input__input c-input__input--text"
                  id="pagination"
                  inputmode="numeric"
                  label="Pagination"
                  max="3"
                  min="1"
                  name="pagination"
                  pattern="[0-9]*"
                  placeholder=""
                  type="text"
                  value="1"
                />
              </div>
            </div>
          </form>
          <span
            class="c-pagination__count"
          >
            of 3
          </span>
        </div>
        <button
          aria-label="Next Page"
          class="c-button c-button--primary c-button--is-icon"
          data-testid="button"
        >
          <img
            alt=""
            role="presentation"
            src="ChevronRight.svg"
          />
        </button>
      </div>
    </div>
  `);
});
