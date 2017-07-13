const includes = (container, value) => container.indexOf(value) >= 0;

const unique = (value, index, self) => self.indexOf(value) === index;

const diff = (original, toSubstract) => original.filter((i) => toSubstract.indexOf(i) < 0);

const filterEmpty = (array) => array.filter((elem) => elem);

const validateEmail = (email) => {
	var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
	return regexp.test(email);
}

const prettyNum = (num) => {
	return (num < 10 ? '0' : '') + num;
}

export { includes, unique, diff, filterEmpty, validateEmail, prettyNum };
