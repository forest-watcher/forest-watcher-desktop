import { TemplateModel } from "generated/core/coreSchemas";

export const getTemplateDate = (template: TemplateModel) => {
  let parsedDate: string | number = parseInt(template.createdAt || "", 10);

  if (isNaN(parsedDate)) {
    parsedDate = template?.createdAt || "";
  }

  return new Date(parsedDate);
};
