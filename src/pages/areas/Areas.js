import * as React from "react";
import PropTypes from "prop-types";
import Hero from "../../components/layouts/Hero";
import Article from "../../components/layouts/Article";
import GridGallery from "../../components/layouts/GridGallery";
import AreaCard from "../../components/area-card/AreaCardContainer";
import Icon from "../../components/ui/Icon";
import { FormattedMessage } from "react-intl";
import Loader from "../../components/ui/Loader";
import { trimQueryParams } from "../../helpers/login.js";
import ReactGA from "react-ga";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "components/ui/Form/Input";

const schema = yup
  .object({
    exampleInput: yup.string().required()
  })
  .required();

const FormTemplate = args => {
  const { register, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema)
  });
  console.log(watch("exampleInput"), formState.errors);
  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...args}
        registered={register("exampleInput", { required: true })}
        error={formState.errors.exampleInput}
      />
      <input type="submit" />
    </form>
  );
};

class Areas extends React.Component {
  UNSAFE_componentWillMount() {
    trimQueryParams(this.props);
  }

  getAddArea = () => {
    if (this.props.loading) return null;
    return (
      <ReactGA.OutboundLink eventLabel="Add new area" to="/areas/create">
        <button className="c-add-card">
          <Icon name="icon-plus" className="-medium -green" />
          <span className="text -x-small-title -green">
            <FormattedMessage id="areas.addArea" />
          </span>
        </button>
      </ReactGA.OutboundLink>
    );
  };

  render() {
    const { areasList } = this.props;
    return (
      <div>
        <Hero title="areas.title" />
        <div className="l-content">
          <Article title="areas.subtitle">
            <GridGallery
              collection={areasList}
              className="area-card-item"
              columns={{ small: 12, medium: 4, large: 3 }}
              Component={AreaCard}
              after={this.getAddArea()}
            />
            <Loader isLoading={this.props.loading} />
          </Article>
          <FormTemplate
            id="text-input"
            htmlInputProps={{
              type: "text",
              placeholder: "Enter text",
              label: "Don't enter and click submit",
              onChange: () => {}
            }}
          />
        </div>
      </div>
    );
  }
}

Areas.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  areasList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Areas;
