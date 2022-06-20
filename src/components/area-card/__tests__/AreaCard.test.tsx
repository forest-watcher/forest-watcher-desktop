import AreaCard from "../AreaCard";
import { render } from "test-utils";
import mockArea from "./area.json";
import { TAreasResponse } from "services/area";

describe("AreaCard", () => {
  it("should render correctly", () => {
    // @ts-ignore mock isn't in the correct shape
    const { container } = render(<AreaCard area={mockArea as TAreasResponse} className="c-class-name" />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="c-card c-card--large c-area-card c-class-name"
          data-testid="card"
        >
          <img
            alt=""
            class="c-card__image c-area-card__image"
            loading="lazy"
            src="https://s3.amazonaws.com/forest-watcher-files/areas-staging/0af2690c-d068-47fa-97f7-ada4a70f3895.png"
          />
          <div
            class="c-card__content-flex"
          >
            <div>
              <h2
                class="c-card__title u-margin-top-none"
              >
                Poole Park
              </h2>
            </div>
            <a
              class="c-card__cta"
              href="/areas/62a9d86f378080001b0d4e29"
            >
              <img
                alt=""
                class="c-card__cta-image"
                role="presentation"
                src="Edit.svg"
              />
              <span>
                Manage
              </span>
            </a>
          </div>
        </div>
      </div>
    `);
  });
});
