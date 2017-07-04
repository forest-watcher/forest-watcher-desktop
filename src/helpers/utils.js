const includes = (container, value) => {
	let returnValue = false;
	const position = container.indexOf(value);
	if (position >= 0) { returnValue = true;}
	return returnValue;
}

const unique = (value, index, self) => { 
    return self.indexOf(value) === index;
}

export { includes, unique };
