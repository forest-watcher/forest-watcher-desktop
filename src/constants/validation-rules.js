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

const url = {
  rule: value => validator.isURL(value),
  hint: () => <span className="form-error -url">Url not valid</span>
};

const passwordConfirmation = {
  rule: (value, components) => value === components.password.state.value,
  hint: () => <span className="form-error -password-confirmation">Passwords don't match</span>
};

const urlTile = {
  hint: value => <span className="form-error is-visible">Text is not a URL tile layer</span>,
  rule: (value) => {
    if (!value) return false;
    const parts = value.split('/{z}/{x}/{y}');
    if (parts.length !== 2) return false;
    const isUrl = validator.isURL(parts[0]);
    const isImage = (parts[1].startsWith('.') && validator.isAlphanumeric(parts[1].slice(1)));
    const noExtension = parts[1] === '';
    return (isUrl && (isImage || noExtension));
  }
};

export { required, url, email, passwordConfirmation, urlTile };
