module.exports = {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/preset-create-react-app"],
  "framework": "@storybook/react",
  core: {
    builder: "webpack5"
  },
  env: (config) => ({
    ...config,
    REACT_APP_MAPBOX_ACCESS_TOKEN: process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN,
    REACT_APP_CARTO_COUNTRIES: process.env.STORYBOOK_CARTO_COUNTRIES
  })
};