import React from 'react';
import validator from 'validator';

const required = {
  rule: value => (value ? value.toString().trim() : ''),
  hint: () => <span className="form-error -required">Required</span>
};

export { required };
