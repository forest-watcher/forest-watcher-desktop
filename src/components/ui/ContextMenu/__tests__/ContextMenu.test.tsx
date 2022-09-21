import ContextMenu, { IProps as IContextMenuProps } from "../ContextMenu";
import { render as utilRender, fireEvent, waitFor, act } from "../../../../test-utils";

const mockMenuItems: IContextMenuProps["menuItems"] = [
  { name: "Foo", value: "testValue1", onClick: jest.fn() },
  { name: "Bar", value: "testValue2", onClick: jest.fn() }
];

describe("ContextMenu Component", () => {
  let menuItems: typeof mockMenuItems;

  beforeEach(() => {
    menuItems = mockMenuItems;
  });

  const render = (args?: Omit<Omit<IContextMenuProps, "menuItems">, "portal">) =>
    utilRender(<ContextMenu portal={false} menuItems={menuItems} {...args} />);

  it("should render correctly", () => {
    const { container } = render();

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          aria-expanded="false"
          aria-haspopup="true"
          aria-label="Open Menu"
          class="szh-menu-button c-button c-context-menu__toggle"
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
        <div
          class="szh-menu-container szh-menu-container--itemTransition"
        />
      </div>
    `);
  });

  it("should render context menu when toggle is clicked", async () => {
    const { container, getByTestId, findByRole } = render();

    fireEvent.click(getByTestId("menuToggle"));

    const contextMenu = await findByRole("menu");
    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-open")).toBe(true));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          aria-expanded="true"
          aria-haspopup="true"
          aria-label="Open Menu"
          class="szh-menu-button szh-menu-button--open c-button c-context-menu__toggle"
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
        <div
          class="szh-menu-container szh-menu-container--itemTransition"
        >
          <ul
            aria-label="Menu"
            class="szh-menu szh-menu--state-open szh-menu--dir-bottom c-context-menu"
            role="menu"
            style="left: 0px; top: 0px;"
            tabindex="-1"
          >
            <li
              class="szh-menu__item szh-menu__item--hover c-context-menu__item"
              role="menuitem"
              tabindex="0"
            >
              Foo
            </li>
            <li
              class="szh-menu__item c-context-menu__item"
              role="menuitem"
              tabindex="-1"
            >
              Bar
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  it("should close context menu when toggle looses focus", async () => {
    const { container, getByTestId, findByRole } = render();

    const menuToggle = getByTestId("menuToggle");

    fireEvent.click(menuToggle);

    const contextMenu = await findByRole("menu");

    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-open")).toBe(true));

    act(() => {
      // https://github.com/szhsin/react-menu/issues/3#issuecomment-721712406
      menuToggle.focus();
    });

    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-closed")).toBe(true));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          aria-expanded="false"
          aria-haspopup="true"
          aria-label="Open Menu"
          class="szh-menu-button c-button c-context-menu__toggle"
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
        <div
          class="szh-menu-container szh-menu-container--itemTransition"
        >
          <ul
            aria-label="Menu"
            class="szh-menu szh-menu--state-closed szh-menu--dir-bottom c-context-menu"
            role="menu"
            style="left: 0px; top: 0px;"
            tabindex="-1"
          >
            <li
              class="szh-menu__item c-context-menu__item"
              role="menuitem"
              tabindex="-1"
            >
              Foo
            </li>
            <li
              class="szh-menu__item c-context-menu__item"
              role="menuitem"
              tabindex="-1"
            >
              Bar
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  it("should render extra classNames correctly", async () => {
    menuItems = mockMenuItems.map(menuItem => ({ className: "myMenuItemClassName", ...menuItem }));

    const { container, getByTestId, findByRole } = render({
      className: "myMenuClassName",
      toggleClassName: "myToggleClassName"
    });

    fireEvent.click(getByTestId("menuToggle"));

    const contextMenu = await findByRole("menu");
    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-open")).toBe(true));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          aria-expanded="true"
          aria-haspopup="true"
          aria-label="Open Menu"
          class="szh-menu-button szh-menu-button--open c-button c-context-menu__toggle myToggleClassName"
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
        <div
          class="szh-menu-container szh-menu-container--itemTransition"
        >
          <ul
            aria-label="Menu"
            class="szh-menu szh-menu--state-open szh-menu--dir-bottom c-context-menu myMenuClassName"
            role="menu"
            style="left: 0px; top: 0px;"
            tabindex="-1"
          >
            <li
              class="szh-menu__item szh-menu__item--hover c-context-menu__item myMenuItemClassName"
              role="menuitem"
              tabindex="0"
            >
              Foo
            </li>
            <li
              class="szh-menu__item c-context-menu__item myMenuItemClassName"
              role="menuitem"
              tabindex="-1"
            >
              Bar
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  it("should close context menu when a menu item is clicked", async () => {
    const { getByText, findByRole, getByTestId } = render();

    // Open Context Menu
    fireEvent.click(getByTestId("menuToggle"));
    const contextMenu = await findByRole("menu");
    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-open")).toBe(true));

    // Click a menu item
    const menuItem = getByText(menuItems[0].name);
    fireEvent.click(menuItem);

    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-closed")).toBe(true));
  });

  it("should fire the mocked onClick handler when a menu item is clicked", async () => {
    const { getByText, findByRole, getByTestId } = render();

    // Open Context Menu
    fireEvent.click(getByTestId("menuToggle"));
    const contextMenu = await findByRole("menu");
    await waitFor(() => expect(contextMenu.classList.contains("szh-menu--state-open")).toBe(true));

    // Click a menu item
    const menuItem = getByText(menuItems[0].name);
    fireEvent.click(menuItem);

    expect(menuItems[0].onClick).toHaveBeenCalled();
    expect(menuItems[1].onClick).not.toHaveBeenCalled();
  });
});
