import DataTable, { IProps as IDataTableProps } from "../DataTable";
import { render as utilRender } from "../../../../test-utils";

type TDataTableRows = {
  name: string;
  email: string;
};

const mockRowData: TDataTableRows[] = [
  {
    name: "Foo",
    email: "foo@user.com"
  },
  {
    name: "Bar",
    email: "bar@user.com"
  }
];

describe("DataTable Component", () => {
  let columnOrder: IDataTableProps<TDataTableRows>["columnOrder"];

  beforeEach(() => {
    columnOrder = ["name", "email"];
  });

  const render = (args?: Omit<Omit<IDataTableProps<TDataTableRows>, "rows">, "columnOrder">) =>
    utilRender(<DataTable<TDataTableRows> rows={mockRowData} columnOrder={columnOrder} {...args} />);

  it("should render correctly", () => {
    const { container } = render();

    expect(container).toMatchInlineSnapshot(`
      <div>
        <table
          class="c-data-table"
        >
          <thead
            class="c-data-table__header"
          >
            <tr>
              <th>
                name
              </th>
              <th>
                email
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="c-data-table__row"
            >
              <td>
                Foo
              </td>
              <td>
                foo@user.com
              </td>
            </tr>
            <tr
              class="c-data-table__row"
            >
              <td>
                Bar
              </td>
              <td>
                bar@user.com
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });

  it("should change the order of the columns", () => {
    columnOrder = ["email", "name"];

    const { container } = render();

    expect(container).toMatchInlineSnapshot(`
      <div>
        <table
          class="c-data-table"
        >
          <thead
            class="c-data-table__header"
          >
            <tr>
              <th>
                email
              </th>
              <th>
                name
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="c-data-table__row"
            >
              <td>
                foo@user.com
              </td>
              <td>
                Foo
              </td>
            </tr>
            <tr
              class="c-data-table__row"
            >
              <td>
                bar@user.com
              </td>
              <td>
                Bar
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });

  it("should render row actions", () => {
    const { container } = render({
      rowActions: [
        {
          name: "Edit",
          onClick: () => {}
        },
        {
          name: "Delete",
          onClick: () => {}
        }
      ]
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <table
          class="c-data-table"
        >
          <thead
            class="c-data-table__header"
          >
            <tr>
              <th>
                name
              </th>
              <th>
                email
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              class="c-data-table__row"
            >
              <td>
                Foo
              </td>
              <td>
                foo@user.com
              </td>
              <td
                class="c-data-table__action-cell"
              >
                <button
                  aria-expanded="false"
                  aria-haspopup="true"
                  aria-label="Open Menu"
                  class="szh-menu-button c-button c-context-menu__toggle c-data-table__action-toggle"
                  data-testid="menuToggle"
                  type="button"
                >
                  <img
                    alt=""
                    class="c-context-menu__icon"
                    role="presentation"
                    src="kebab.svg"
                  />
                  <img
                    alt=""
                    class="c-context-menu__icon c-context-menu--hover"
                    role="presentation"
                    src="kebab-hover.svg"
                  />
                </button>
              </td>
            </tr>
            <tr
              class="c-data-table__row"
            >
              <td>
                Bar
              </td>
              <td>
                bar@user.com
              </td>
              <td
                class="c-data-table__action-cell"
              >
                <button
                  aria-expanded="false"
                  aria-haspopup="true"
                  aria-label="Open Menu"
                  class="szh-menu-button c-button c-context-menu__toggle c-data-table__action-toggle"
                  data-testid="menuToggle"
                  type="button"
                >
                  <img
                    alt=""
                    class="c-context-menu__icon"
                    role="presentation"
                    src="kebab.svg"
                  />
                  <img
                    alt=""
                    class="c-context-menu__icon c-context-menu--hover"
                    role="presentation"
                    src="kebab-hover.svg"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });

  it("should render extra classNames correctly", () => {
    const { container } = render({
      className: "myClassName"
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <table
          class="c-data-table myClassName"
        >
          <thead
            class="c-data-table__header"
          >
            <tr>
              <th>
                name
              </th>
              <th>
                email
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="c-data-table__row"
            >
              <td>
                Foo
              </td>
              <td>
                foo@user.com
              </td>
            </tr>
            <tr
              class="c-data-table__row"
            >
              <td>
                Bar
              </td>
              <td>
                bar@user.com
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });
});
