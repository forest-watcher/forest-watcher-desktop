import { setLocale } from "yup";

setLocale({
  // use constant translation keys for messages without values
  mixed: {
    default: values => ({ key: "errors.mixed.default", values }),
    notType: values => ({ key: "errors.mixed.notType", values }),
    required: () => ({ key: "errors.mixed.required" })
  },
  // use functions to generate an error object that includes the value from the schema
  number: {
    min: ({ min }) => ({ key: "errors.number.min", values: { min } }),
    max: ({ max }) => ({ key: "errors.number.max", values: { max } })
  },
  string: {
    min: ({ min }) => ({ key: "errors.string.min", values: { min } }),
    email: () => ({ key: "errors.string.email" })
  },
  array: {
    min: ({ min }) => ({ key: "errors.array.min", values: { min } })
  }
});
