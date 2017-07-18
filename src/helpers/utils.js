const includes = (container, value) => container.indexOf(value) >= 0;

const unique = (value, index, self) => self.indexOf(value) === index;

const diff = (original, toSubstract) => original.filter((i) => toSubstract.indexOf(i) < 0);

const filterEmpty = (array) => array.filter((elem) => elem);

const validateEmail = (email) => {
	var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
	return regexp.test(email);
}

const equals = function (array, otherArray) {
    if (!array || otherArray.length !== array.length) return false;
    for (var i = 0, l=otherArray.length; i < l; i++) {
        // Check if we have nested arrays
        if (otherArray[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!otherArray[i].equals(array[i])) return false;       
        }
        else if (otherArray[i] !== array[i]) return false;
    }       
    return true;
}



export { includes, unique, diff, filterEmpty, validateEmail, equals };
