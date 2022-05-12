import { ComponentStory, ComponentMeta } from "@storybook/react";

import Timeframe from "components/ui/Timeframe";
import { useState } from "react";

const periodOptions: Array<any> = [
  {
    label: "Dec/Jun",
    period: "Dec 2015 - Jun 2016",
    year: "2015",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2015-12_2016-05_mosaic"
  },
  {
    label: "Jun/Dec",
    period: "Jun 2016 - Dec 2016",
    year: "2016",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2016-06_2016-11_mosaic"
  },
  {
    label: "Dec/Jun",
    period: "Dec 2016 - Jun 2017",
    year: "2016",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2016-12_2017-05_mosaic"
  },
  {
    label: "Jun/Dec",
    period: "Jun 2017 - Dec 2017",
    year: "2017",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2017-06_2017-11_mosaic"
  },
  {
    label: "Dec/Jun",
    period: "Dec 2017 - Jun 2018",
    year: "2017",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2017-12_2018-05_mosaic"
  },
  {
    label: "Jun/Dec",
    period: "Jun 2018 - Dec 2018",
    year: "2018",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2018-06_2018-11_mosaic"
  },
  {
    label: "Dec/Jun",
    period: "Dec 2018 - Jun 2019",
    year: "2018",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2018-12_2019-05_mosaic"
  },
  {
    label: "Jun/Dec",
    period: "Jun 2019 - Dec 2019",
    year: "2019",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2019-06_2019-11_mosaic"
  },
  {
    label: "Dec/Jun",
    period: "Dec 2019 - Jun 2020",
    year: "2019",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2019-12_2020-05_mosaic"
  },
  {
    label: "Jun/Sep",
    period: "Jun 2020 - Sep 2020",
    year: "2020",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2020-06_2020-08_mosaic"
  },
  {
    label: "Sep",
    period: "Sep 2020",
    year: "2020",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2020-09_mosaic"
  },
  {
    label: "Oct",
    period: "Oct 2020",
    year: "2020",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2020-10_mosaic"
  },
  {
    label: "Nov",
    period: "Nov 2020",
    year: "2020",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2020-11_mosaic"
  },
  {
    label: "Dec",
    period: "Dec 2020",
    year: "2020",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2020-12_mosaic"
  },
  {
    label: "Jan",
    period: "Jan 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-01_mosaic"
  },
  {
    label: "Feb",
    period: "Feb 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-02_mosaic"
  },
  {
    label: "Mar",
    period: "Mar 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-03_mosaic"
  },
  {
    label: "Apr",
    period: "Apr 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-04_mosaic"
  },
  {
    label: "May",
    period: "May 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-05_mosaic"
  },
  {
    label: "Jun",
    period: "Jun 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-06_mosaic"
  },
  {
    label: "Jul",
    period: "Jul 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-07_mosaic"
  },
  {
    label: "Aug",
    period: "Aug 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-08_mosaic"
  },
  {
    label: "Sep",
    period: "Sep 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-09_mosaic"
  },
  {
    label: "Oct",
    period: "Oct 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-10_mosaic"
  },
  {
    label: "Nov",
    period: "Nov 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-11_mosaic"
  },
  {
    label: "Dec",
    period: "Dec 2021",
    year: "2021",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2021-12_mosaic"
  },
  {
    label: "Jan",
    period: "Jan 2022",
    year: "2022",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2022-01_mosaic"
  },
  {
    label: "Feb",
    period: "Feb 2022",
    year: "2022",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2022-02_mosaic"
  },
  {
    label: "Mar",
    period: "Mar 2022",
    year: "2022",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2022-03_mosaic"
  },
  {
    label: "Apr",
    period: "Apr 2022",
    year: "2022",
    imageType: "visual",
    sortOrder: "Thu May 12 2022 13:30:59 GMT+0100 (British Summer Time)",
    proc: "",
    value: "planet_medres_visual_2022-04_mosaic"
  }
];

const periodSelectedIndex = 29;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Timeframe",
  component: Timeframe
} as ComponentMeta<typeof Timeframe>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Timeframe> = args => {
  const [index, setIndex] = useState(periodSelectedIndex);
  return (
    <div style={{ maxWidth: 465 }}>
      <Timeframe {...args} selected={index} onChange={value => setIndex(periodOptions.indexOf(value))} />
    </div>
  );
};

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  periods: periodOptions
};
