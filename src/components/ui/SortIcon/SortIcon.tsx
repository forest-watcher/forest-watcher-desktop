import { Direction } from "components/ui/DataTable/DataTable";
import { FC } from "react";

export interface IProps {
  direction: Direction;
}

enum Colours {
  Active = "#94BE43",
  Disabled = "#DCDCDC",
  Default = "#555555"
}

const SortIcon: FC<IProps> = props => {
  const { direction } = props;

  let upArrowColour = Colours.Default;
  let downArrowColour = Colours.Default;

  switch (direction) {
    case Direction.Asc:
      upArrowColour = Colours.Active;
      downArrowColour = Colours.Disabled;
      break;
    case Direction.Desc:
      upArrowColour = Colours.Disabled;
      downArrowColour = Colours.Active;
      break;
  }

  return (
    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
      <path d="M5.4997 0.926758L0 6.98081H11L5.4997 0.926758Z" fill={upArrowColour} />
      <path d="M0 8.87256L5.4997 14.9266L11 8.87256H0Z" fill={downArrowColour} />
    </svg>
  );
};

export default SortIcon;
