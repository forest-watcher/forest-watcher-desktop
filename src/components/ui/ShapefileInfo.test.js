import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import ShapefileInfo from "./ShapefileInfo";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("ShapefileInfo Dialog", () => {
  it("can render", () => {
    act(() => {
      ReactDOM.render(
        <ShapefileInfo
          title="Upload A Custom Data Set"
          maxSize="max size requirements"
          formats="The file must be one of the following:"
          unzippedTitle="Unzipped:"
          unzipped=".csv, .json, .geojson, .kml, .kmz"
          zippedTitle="Zipped:"
          zipped=".shp"
        />,
        container
      );
    });
    const title = container.querySelector("h2");
    const maxSizeMsg = container.querySelector(".test-max-size");
    const formatsMsg = container.querySelector(".test-formats");
    const unzippedMsg = container.querySelector(".test-unzipped");
    const unzippedTitle = container.querySelector(".test-unzipped-title");
    const zippedMsg = container.querySelector(".test-zipped");
    const zippedTitle = container.querySelector(".test-zipped-title");
    const confirmBtn = container.querySelector(".test-confirm-button");

    expect(title.textContent).toBe("Upload A Custom Data Set");
    expect(maxSizeMsg.textContent).toBe("max size requirements");
    expect(formatsMsg.textContent).toBe("The file must be one of the following:");
    expect(unzippedMsg.textContent).toBe("Unzipped: .csv, .json, .geojson, .kml, .kmz");
    expect(unzippedTitle.textContent).toBe("Unzipped:");
    expect(zippedMsg.textContent).toBe("Zipped: .shp");
    expect(zippedTitle.textContent).toBe("Zipped:");
    expect(confirmBtn.textContent).toBe("ok");
  });

  it("calls the onAccept function", () => {
    const mock = jest.fn();
    act(() => {
      ReactDOM.render(
        <ShapefileInfo
          title="Upload A Custom Data Set"
          maxSize="max size requirements"
          formats="The file must be one of the following:"
          unzippedTitle="Unzipped:"
          unzipped=".csv, .json, .geojson, .kml, .kmz"
          zippedTitle="Zipped:"
          zipped=".shp"
          onAccept={mock}
        />,
        container
      );
    });
    const confirmBtn = container.querySelector(".test-confirm-button");
    act(() => {
      confirmBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mock.mock.calls.length).toBe(1);
  });
});
