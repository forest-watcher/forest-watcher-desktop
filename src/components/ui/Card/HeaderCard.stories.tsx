import { ComponentStory, ComponentMeta } from "@storybook/react";
import HeaderCard from "./HeaderCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Cards/Other/Header",
  component: HeaderCard,
  subcomponents: { Content: HeaderCard.Content, Header: HeaderCard.Header, HeaderText: HeaderCard.HeaderText }
} as ComponentMeta<typeof HeaderCard>;

const DetailCardTemplate: ComponentStory<typeof HeaderCard> = args => (
  <div style={{ width: 1080 }}>
    <HeaderCard {...args}>
      <HeaderCard.Header>
        <HeaderCard.HeaderText>I am a card with a header</HeaderCard.HeaderText>
      </HeaderCard.Header>
      <HeaderCard.Content>And some content</HeaderCard.Content>
    </HeaderCard>
  </div>
);

export const DetailCardExample = DetailCardTemplate.bind({});
DetailCardExample.args = {};
