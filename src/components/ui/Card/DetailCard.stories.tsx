import { ComponentStory, ComponentMeta } from "@storybook/react";
import DetailCard from "./DetailCard";
import ReportsIcon from "assets/images/icons/Reports.svg";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Cards/Other/Detail",
  component: DetailCard
} as ComponentMeta<typeof DetailCard>;

const DetailCardTemplate: ComponentStory<typeof DetailCard> = args => (
  <div style={{ width: 333 }}>
    <DetailCard {...args} />
  </div>
);

export const DetailCardExample = DetailCardTemplate.bind({});
DetailCardExample.args = {
  title: "A detail card",
  text: "Neque porro quisquam est, qui dolorem ipsum quia, just making this even longer than we'd like it to be",
  shouldCollapse: true,
  icon: ReportsIcon
};
