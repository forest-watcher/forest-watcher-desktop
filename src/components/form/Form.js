import React from 'react';
import Validation from 'react-validation';
import ReactSelect from 'react-select';
import { FormattedMessage } from 'react-intl';

function withWrapper(Component) {
  return class FormWrapper extends React.Component {
    render() {
      const { label, ...props } = this.props;
      return (
        <div className="form-control">
          {label && <label htmlFor={props.name} ><FormattedMessage id={label} /></label>}
          <Component id={props.name} {...props} />
        </div>
      );
    }
  };
}

const Form = Validation.components.Form;
const Button = Validation.components.Button;
const Input = withWrapper(Validation.components.Input);
const Textarea = withWrapper(Validation.components.Textarea);
const Select = withWrapper(ReactSelect);
const AsyncSelect = withWrapper(ReactSelect.Async);

export { Input, Button, Form, Textarea, Select, AsyncSelect };
