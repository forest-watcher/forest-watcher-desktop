import { components } from "react-select";

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <svg className="c-icon -x-small -gray">
          <use xlinkHref="#icon-arrow-down"></use>
        </svg>
      </components.DropdownIndicator>
    )
  );
};

export default DropdownIndicator;
