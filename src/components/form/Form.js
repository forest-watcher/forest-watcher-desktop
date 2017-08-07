import React from 'react';
import Validation from 'react-validation';
import ReactSelect from 'react-select';
import { FormattedMessage } from 'react-intl';

Object.assign(Validation.rules, {
  urlTile: {
    hint: value => <span className="form-error is-visible">Text is not a URL tile layer</span>,
    rule: (value) => {
      if (!value) return false;
      const parts = value.split('/{z}/{x}/{y}');
      if (parts.length !== 2) return false;
      const isUrl = Validation.rules.url.rule(parts[0]);
      const isImage = ['.png', '.jpg'].indexOf(parts[1]) !== -1;
      return (isUrl && isImage);
    }
  }
});

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
