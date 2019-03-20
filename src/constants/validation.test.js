import * as rules from './validation-rules';
import * as responses from './validation-responses';

describe ('reqired', () => {
  it ('returns the correct JSX when invalid', () => {
    expect(rules.required('')).toEqual(responses.required);
  })

  it ('returns undefined when valid', () => {
    expect(rules.required('A string')).toBeUndefined()
  })
})

describe ('email', () => {
  it ('returns the correct JSX when invalid', () => {
    expect(rules.email('A string')).toEqual(responses.email);
  })

  it ('returns undefined when valid', () => {
    expect(rules.email('atestuser@gmail.com')).toBeUndefined()
  })
})

describe ('url', () => {
  it ('returns the correct JSX when invalid', () => {
    expect(rules.url('A string')).toEqual(responses.url);
  })

  it ('returns undefined when valid', () => {
    expect(rules.url('www.google.com')).toBeUndefined()
  })
})

describe ('password confirmation', () => {
  const dummyComponent = {
          password: {
            state: {
              value: 'a password'
            }
          }
        }

  it ('returns the correct JSX when invalid', () => {
    expect(rules.passwordConfirmation('password', dummyComponent)).toEqual(responses.passwordConfirmation);
  })

  it ('returns undefined when valid', () => {
    expect(rules.passwordConfirmation('a password', dummyComponent)).toBeUndefined()
  })
})
