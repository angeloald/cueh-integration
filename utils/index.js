const stringifyDate = clickupDate => {
  const dateObj = clickupDate ? new Date(parseInt(clickupDate)) : new Date();
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  return `${year}-${month}-${day}`;
};

module.exports = {
  stringifyDate
};
