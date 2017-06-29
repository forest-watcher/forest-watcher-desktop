const includes = (container, value) => {
	let returnValue = false;
	const position = container.indexOf(value);
	if (position >= 0) { returnValue = true;}
	return returnValue;
}

export { includes };
