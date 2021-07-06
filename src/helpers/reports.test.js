import { getReportAlertsByName } from "./reports";
import { alertTypes } from "constants/alerts";

const alertNames = [
  {name: "AREA-DE-INFLUENCIA-CC-NN-CENTRO-ARENAL-GLADSTWO-REPORT--2021-07-02T14:07:14", expected: [alertTypes.glad_sentinel_2]},
  {name: "AREA-DE-INFLUENCIA-CC-NN-CENTRO-ARENAL-GLAD-REPORT--2021-07-02T14:07:14", expected: [alertTypes.umd_as_it_happens]},
  {name: "AREA-DE-INFLUENCIA-CC-NN-CENTRO-ARENAL-RADD-REPORT--2021-07-02T14:07:14", expected: [alertTypes.gfw_radd_alerts]},
  {name: "AREA-DE-INFLUENCIA-CC-NN-CENTRO-ARENAL-VIIRS-REPORT--2021-07-02T14:07:14", expected: [alertTypes.viirs]},
  {name: "AREA-DE-INFLUENCIA-CC-NN-CENTRO-ARENAL-GLADSTWO|GLAD|RADD-REPORT--2021-07-02T14:07:14", expected: [alertTypes.umd_as_it_happens, alertTypes.glad_sentinel_2, alertTypes.gfw_radd_alerts]}
];


describe ('getReportAlertByName', () => {
  it ('Returns the correct alert types', () => {
    alertNames.forEach(item => {
      expect(getReportAlertsByName(item.name)).toEqual(item.expected);
    })
  })

  it ('Returns an empty string when not found', () => {
    expect(getReportAlertsByName("TEST-MC-TEST-FaCe")).toEqual([]);
    expect(getReportAlertsByName("")).toEqual([]);
  })
})
