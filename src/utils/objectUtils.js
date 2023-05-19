const isObjectEmpty = (obj) =>
  obj === undefined || obj === null || (obj && Object.entries(obj).length <= 0);

const getEmailObject = (emails, data, isDefault = true) => {
  let emailObj;
  if (!isArrayEmpty(emails)) {
    if (!isObjectEmpty(data)) {
      const { emailsCoyPreference, coyId } = data;
      if (!isObjectEmpty(emailsCoyPreference)) {
        emailObj = emails.find(
          (email) => emailsCoyPreference[coyId] === email._id.toString(),
        );
      }
    } else {
      emailObj = emails.find((email) => email.isPrimary);
    }
  }
  return isObjectEmpty(emailObj) && !isDefault ? {} : emailObj || emails[0];
};

const isObject = (obj) =>
  obj !== null && typeof obj === 'object' && !Array.isArray(obj);

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 0) return 0;

  return age;
};
module.exports = {
  getEmailObject,
  isObject,
  isObjectEmpty,
  calculateAge,
};
