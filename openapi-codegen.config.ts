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
  alerts: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_alerts/dev/docs/fw_alerts.yaml"
    },
    outputDir: "src/generated/alerts",
    to: async context => {
      const filenamePrefix = "alerts";
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
  },
  core: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_core/dev/docs/fw_core.yaml"
    },
    outputDir: "src/generated/core",
    to: async context => {
      const filenamePrefix = "core";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  },
  users: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_users/dev/docs/fw_users.yaml"
    },
    outputDir: "src/generated/users",
    to: async context => {
      const filenamePrefix = "users";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  },
  clayers: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/wri/fw_contextual_layers/dev/docs/fw_contextual_layers.yaml"
    },
    outputDir: "src/generated/clayers",
    to: async context => {
      const filenamePrefix = "clayers";
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
