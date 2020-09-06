const arrayToObjectConversion = input => {
  const convertToObject = {};

  // Object.entries returns both the keys and values
  // We have to create a new object since input is not iterable for raw form
  for (const [key, value] of Object.entries(input)) {
    convertToObject[key] = value;
  }

  return convertToObject;
};

const arrayToObjectConversion2 = input => {
  // This is line is necessary if and only the input is not iterable
  const iterableInput = Object.entries(input);

  // We need to convert our previous variable/input to a map
  const convertToMap = new Map(iterableInput);

  // Now, by applying Object.fromEntries we can convert the map to object
  const convertToObject = Object.fromEntries(convertToMap);

  return convertToObject;
};

module.exports.arrayToObjectConversion = arrayToObjectConversion;
module.exports.arrayToObjectConversion2 = arrayToObjectConversion2;
