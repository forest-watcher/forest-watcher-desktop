import { generateSchemaTypes, generateReactQueryComponents } from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  api: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_api/dev/docs/fw_api.yaml"
    },
    outputDir: "src/generated/api",
    to: async context => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  },
  teams: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_teams/dev/docs/fw_teams.yaml"
    },
    outputDir: "src/generated/teams",
    to: async context => {
      const filenamePrefix = "teams";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  },
  exports: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_exports/dev/docs/fw_exports.yaml"
    },
    outputDir: "src/generated/exports",
    to: async context => {
      const filenamePrefix = "exports";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  },
  forms: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_forms/dev/docs/fw_forms.yaml"
    },
    outputDir: "src/generated/forms",
    to: async context => {
      const filenamePrefix = "forms";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  }
});
