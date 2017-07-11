import { includes, unique, diff, filterEmpty, validateEmail } from './utils';
describe ('includes', () => 
	it ('returns true only if the value is included in the array', () => {
		expect(includes([1,2,3], 1)).toEqual(true);
		expect(includes([1,2,3], 0)).toEqual(false);
	})
)

describe ('unique', () => 
	it ('returns only unique values in the array', () => {
		expect([1,2,3,1].filter(unique)).toEqual([1,2,3]);
	})
)

describe ('filterEmpty', () => 
	it ('filters empty or undefined elements in a array', () => {
		expect(filterEmpty([1,2,3, undefined, null])).toEqual([1,2,3]);
	})
)

describe ('validateEmail', () => 
	it ('returns true if the email is valid', () => {
		expect(validateEmail('blues@man.es')).toEqual(true);
		expect(validateEmail('bluesman.es')).toEqual(false);
		expect(validateEmail('blues.man.es')).toEqual(false);
	})
)