function matchesTaskFilters(task, filters) {
  if (!Array.isArray(filters) || filters.length === 0) {
    return true;
  }

  return filters.every((filter) => matchesFilter(task, filter));
}

function matchesFilter(task, filter) {
  const fieldValue = task.fields?.[filter.field];
  const values = Array.isArray(filter.values) ? filter.values : [];

  switch (filter.operator) {
    case "equals":
      return fieldValue === values[0];
    case "notEquals":
      return fieldValue !== values[0];
    case "in":
      return values.includes(fieldValue);
    case "notIn":
      return !values.includes(fieldValue);
    case "exists":
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    case "notExists":
      return fieldValue === undefined || fieldValue === null || fieldValue === "";
    default:
      return false;
  }
}

module.exports = {
  matchesTaskFilters
};
