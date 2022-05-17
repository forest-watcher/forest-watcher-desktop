import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "components/ui/Card/Card";
import { BrowserRouter, Link } from "react-router-dom";
import EditIcon from "assets/images/icons/Edit.svg";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Cards",
  component: Card,
  subcomponents: { Image: Card.Image, Title: Card.Title, Text: Card.Text, Cta: Card.Cta }
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const LargeImageCardTemplate: ComponentStory<typeof Card> = args => (
  <Card {...args}>
    <Card.Image alt="Placeholder picture" src="https://picsum.photos/293/160" />
    <Card.Title>Area</Card.Title>
    <Card.Text>Some text</Card.Text>
  </Card>
);

const LargeImageCardAsLinkTemplate: ComponentStory<typeof Card> = args => (
  <BrowserRouter>
    <Card {...args} to="/">
      <Card.Image alt="Placeholder picture" src="https://picsum.photos/293/160" />
      <div className="c-card__content-flex">
        <div>
          <Card.Title>Area</Card.Title>
          <Card.Text>Some text</Card.Text>
        </div>
        <Card.Cta iconSrc={EditIcon}>Manage</Card.Cta>
      </div>
    </Card>
  </BrowserRouter>
);

const SmallImageCardTemplate: ComponentStory<typeof Card> = args => (
  <Card {...args}>
    <Card.Image alt="Placeholder picture" src="https://picsum.photos/200" />
    <Card.Title>Area with a load of text</Card.Title>
    <Card.Text>Some text</Card.Text>
  </Card>
);

export const LargeImageCard = LargeImageCardTemplate.bind({});
LargeImageCard.args = {
  size: "large"
};

export const LargeImageCardAsLink = LargeImageCardAsLinkTemplate.bind({});
LargeImageCardAsLink.args = {
  size: "large",
  as: Link
};

export const SmallImageCard = SmallImageCardTemplate.bind({});
SmallImageCardTemplate.args = {
  size: "small"
};