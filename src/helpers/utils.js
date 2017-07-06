const includes = (container, value) => {
	let returnValue = false;
	const position = container.indexOf(value);
	if (position >= 0) { returnValue = true;}
	return returnValue;
}

const unique = (value, index, self) => { 
    return self.indexOf(value) === index;
}

const diff = (original, toSubstract) => {
	return original.filter((i) => toSubstract.indexOf(i) < 0);
};

const filterEmpty = (array) => array.filter((elem) => elem);

const validateEmail = (email) => {
	var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
	return regexp.test(email);
}
export { includes, unique, diff, filterEmpty, validateEmail };
