export const CSV_EXPORT_FILE_TYPE = {
  label: "CSV",
  value: "csv"
};

export const GEOJSON_EXPORT_FILE_TYPE = {
  label: "GeoJson",
  value: "geojson"
};

export const SHP_EXPORT_FILE_TYPE = {
  label: "SHP",
  value: "shp"
};

export const FWBUNDLE_EXPORT_FILE_TYPE = {
  label: "FW Bundle",
  value: "fwbundle"
};

export const PDF_EXPORT_FILE_TYPE = {
  label: "PDF",
  value: "pdf"
};

export const ZIP_EXPORT_FILE_TYPE = {
  label: "ZIP",
  value: "zip"
};

export const AREA_EXPORT_FILE_TYPES = [
  CSV_EXPORT_FILE_TYPE,
  GEOJSON_EXPORT_FILE_TYPE,
  SHP_EXPORT_FILE_TYPE,
  FWBUNDLE_EXPORT_FILE_TYPE
];

export const REPORT_EXPORT_FILE_TYPES = [
  CSV_EXPORT_FILE_TYPE,
  GEOJSON_EXPORT_FILE_TYPE,
  SHP_EXPORT_FILE_TYPE,
  FWBUNDLE_EXPORT_FILE_TYPE,
  PDF_EXPORT_FILE_TYPE
];

export const ASSIGNMENT_FIELDS = [
  "id",
  "areaId",
  "createdAt",
  "createdBy",
  "geostore",
  "image",
  "location",
  "monitorNames",
  "name",
  "notes",
  "priority",
  "status",
  "templates"
];

export const REPORT_EXPORT_IMAGES_TYPES = [ZIP_EXPORT_FILE_TYPE, PDF_EXPORT_FILE_TYPE];
