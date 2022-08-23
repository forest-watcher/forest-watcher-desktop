import TeamCard, { IProps as ITeamCardProps } from "./TeamCard";
import { render as utilRender } from "../../../test-utils";

const mockTeam: ITeamCardProps["team"] = {
  type: "team",
  id: "1234",
  attributes: {
    name: "My Team",
    userRole: "administrator",
    createdAt: "2022-05-17T10:59:07.136Z"
  }
};

const mockTeamMembers: ITeamCardProps["teamMembers"] = [
  {
    type: "teamUser",
    id: "1234",
    attributes: {
      teamId: "1234",
      userId: "1234",
      email: "user@test.com",
      status: "confirmed",
      role: "administrator"
    }
  },
  {
    type: "teamUser",
    id: "1234",
    attributes: {
      teamId: "1234",
      email: "user+gfw@test.com",
      status: "invited",
      role: "monitor"
    }
  },
  {
    type: "teamUser",
    id: "1234",
    attributes: {
      teamId: "1234",
      userId: "1234",
      email: "user+gfw1@test.com",
      status: "confirmed",
      role: "manager"
    }
  }
];

// const mockTeamAreas = [
//   { type: "area", id: "6233708756b0c7001bf95232", attributes: { name: "Area #1" } },
//   { type: "area", id: "6233708756b0c7001bf95232", attributes: { name: "Area #2" } },
//   { type: "area", id: "6233708756b0c7001bf95232", attributes: { name: "Area #3" } }
// ];

const mockTeamAreas = ["Area #1", "Area #2", "Area #3"];

describe("TeamCard", () => {
  let getTeamMembers = jest.fn(),
    getTeamAreas = jest.fn();

  const render = () =>
    utilRender(
      <TeamCard
        team={mockTeam}
        teamMembers={mockTeamMembers}
        teamAreas={mockTeamAreas}
        getTeamMembers={getTeamMembers}
        getTeamAreas={getTeamAreas}
        areasDetail={undefined}
      />
    );

  it("should render correctly", () => {
    const { container } = render();

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="c-card c-card--large c-teams__card"
          data-testid="card"
        >
          <div
            class="c-teams__title"
          >
            <div
              class="c-teams__title-text"
            >
              <h2
                class="c-card__title u-margin-top-none"
              >
                My Team
              </h2>
            </div>
            <a
              class="c-card__cta"
              href="/teams/1234"
            >
              <img
                alt=""
                class="c-card__cta-image"
                role="presentation"
                src="Edit.svg"
              />
              <span>
                Manage Team
              </span>
            </a>
          </div>
          <div
            class="c-card c-card--large c-teams__card c-teams--nested-card c-teams--nested-card-people"
            data-testid="card"
          >
            <div>
              <h3
                class="c-teams__sub-title"
              >
                2 Managers:
              </h3>
              <p>
                user@test.com, user+gfw1@test.com
              </p>
            </div>
            <div>
              <h3
                class="c-teams__sub-title"
              >
                0 Monitors:
              </h3>
              <p />
            </div>
          </div>
          <div
            class="c-card c-card--large c-teams__card c-teams--nested-card"
            data-testid="card"
          >
            <div
              class="flex-container align-justify"
            >
              <div
                class="c-teams__area-text"
              >
                <h3
                  class="c-teams__sub-title"
                >
                  Areas:
                </h3>
                <p>
                  Area #1, Area #2, Area #3
                </p>
              </div>
              <a
                class="c-card__cta"
                href="/areas"
              >
                <img
                  alt=""
                  class="c-card__cta-image"
                  role="presentation"
                  src="Edit.svg"
                />
                <span>
                  Manage Area
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  it("should call getTeamMembers dispatcher once", () => {
    render();

    expect(getTeamMembers).toHaveBeenCalledTimes(1);
  });

  it("should call getTeamAreas dispatcher once", () => {
    render();

    expect(getTeamAreas).toHaveBeenCalledTimes(1);
  });
});
