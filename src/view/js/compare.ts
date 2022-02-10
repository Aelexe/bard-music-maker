/**
 * Deep compares two object.
 *
 * @param object1 First object to compare.
 * @param object2 Second object to compare.
 * @returns Whether the objects are equal.
 */
export function isEqual(object1: any, object2: any): boolean {
	if ((object1 === undefined) !== (object2 === undefined)) {
		return false;
	}

	const keys = Object.keys(object1);
	const comparisonKeys = Object.keys(object2);

	if (keys.length !== comparisonKeys.length) {
		return false;
	}

	for (const i in keys) {
		const key = keys[i];
		const type = typeof object1[key];

		if (type !== typeof object2[key]) {
			return false;
		}

		if (type === "object") {
			if (!isEqual(object1[key], object2[key])) {
				return false;
			}
		} else {
			if (object1[key] !== object2[key]) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Checkes whether the first object contains all the keys and values of the second.
 *
 * @param object Object to compare.
 * @param comparisonObject Object to compare to.
 * @returns Whether the first object contains all the keys and values of the second.
 */
export function hasValuesOf(object: any, comparisonObject: any) {
	if (object === undefined) {
		if (comparisonObject === undefined) {
			return true;
		} else {
			return false;
		}
	}

	if (comparisonObject === undefined || comparisonObject === null) {
		return true;
	}

	const keys = Object.keys(comparisonObject);

	let hasValues = true;

	keys.every((key) => {
		const type = typeof object[key];

		if (type !== typeof comparisonObject[key]) {
			hasValues = false;
			return false;
		}

		if (type === "object") {
			if (!hasValuesOf(object[key], comparisonObject[key])) {
				hasValues = false;
				return false;
			}
		} else {
			if (object[key] !== comparisonObject[key]) {
				hasValues = false;
				return false;
			}
		}

		return true;
	});

	return hasValues;
}
