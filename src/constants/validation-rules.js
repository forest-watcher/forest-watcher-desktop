import validator from 'validator';
import * as responses from './validation-responses'

const required = (value) => {
  if (!value.toString().trim().length) {
    return responses.required
  }
};

const email = (value) => {
  if (!validator.isEmail(value)) {
    return responses.email
  }
};

const url = (value) => {
  if (!validator.isURL(value)) {
    return responses.url
  }
};

const passwordConfirmation = (value, components) => {
  if (value !== components.password.state.value) {
    return responses.passwordConfirmation
  }
};

const urlTile = (value) => {
  if (!value) {
    return responses.urlTile
  }

  const parts = value.split('/{z}/{x}/{y}');

  if (parts.length !== 2) {
    return responses.urlTile
  }

  const isUrl = validator.isURL(parts[0]);
  const isImage = (parts[1].startsWith('.') && validator.isAlphanumeric(parts[1].slice(1)));
  const noExtension = parts[1] === '';

  if (!(isUrl && (isImage || noExtension))) {
    return responses.urlTile
  }
};

export { required, url, email, passwordConfirmation, urlTile };
