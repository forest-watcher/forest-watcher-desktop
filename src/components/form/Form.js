import React from "react";
import ReactSelect from "react-select";
import { FormattedMessage } from "react-intl";

import Form from "react-validation/build/form";
import Button from "react-validation/build/button";
import TextareaComponent from "react-validation/build/textarea";
import InputComponent from "react-validation/build/input";

function withWrapper(Component) {
  return class FormWrapper extends React.Component {
    render() {
      const { label, ...props } = this.props;
      return (
        <div className="form-control">
          {label && (
            <label htmlFor={props.name}>
              <FormattedMessage id={label} />
            </label>
          )}
          <Component id={props.name} {...props} />
        </div>
      );
    }
  };
}

const Input = withWrapper(InputComponent);
const Textarea = withWrapper(TextareaComponent);
const Select = withWrapper(ReactSelect);
const AsyncSelect = withWrapper(ReactSelect.Async);

export { Input, Button, Form, Textarea, Select, AsyncSelect };
