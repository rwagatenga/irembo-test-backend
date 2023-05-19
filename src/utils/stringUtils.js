const { getEmailObject, isObjectEmpty } = require('./objectUtils');

const getFilterRegex = (...filters) => {
  // For handling special characters
  const handledStrings = filters.map((filter) =>
    filter.map((filterString) =>
      filterString.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&'),
    ),
  );
  const regexString = handledStrings.reduce(
    (result, filter) => result.concat(`(${filter.join('|')})`),
    [],
  );
  return filters.length > 1 ? regexString.join('.') : regexString[0];
};

module.exports = {
  getFilterRegex,
};
