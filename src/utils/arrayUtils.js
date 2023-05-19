const isArrayEmpty = (array) =>
  !array || !Array.isArray(array) || array.length === 0;

module.exports = {
  isArrayEmpty,
};
