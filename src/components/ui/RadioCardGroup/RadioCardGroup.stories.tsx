import { ComponentStory, ComponentMeta } from "@storybook/react";

import RadioCardGroup from "components/ui/RadioCardGroup/RadioCardGroup";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/RadioCardGroup",
  component: RadioCardGroup
} as ComponentMeta<typeof RadioCardGroup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RadioCardGroup> = args => <RadioCardGroup {...args} />;

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  label: "label",
  onChange: v => {},
  options: [
    {
      value: "satellite",
      name: "Satellite",
      image:
        "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-5.9095,54.6064,6.9,0/840x464?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
    },
    {
      value: "light",
      name: "Light",
      image:
        "https://api.mapbox.com/styles/v1/mapbox/light-v10/static/37.6146,55.7493,10.19,0/840x464?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
    },
    {
      value: "dark",
      name: "Dark",
      image:
        "https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/23.7126,37.9757,8.78,0/840x464?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
    },
    {
      value: "planet",
      name: "Planet Imagery",
      image:
        "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/133.9687,-25.6122,1.85,0/840x464?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
    }
  ]
};
