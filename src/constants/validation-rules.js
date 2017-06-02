import React from 'react';
import validator from 'validator';

const required = {
  rule: value => (value ? value.toString().trim() : ''),
  hint: () => <span className="form-error -required">Required</span>
};

const email = {
  rule: value => validator.isEmail(value),
  hint: () => <span className="form-error -email">Email not valid</span>
};

const passwordConfirmation = {
  rule: (value, components) => value === components.password.state.value,
  hint: () => <span className="form-error -password-confirmation">Passwords don't match</span>
};

export { required, email, passwordConfirmation };
