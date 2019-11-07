const toTitleCase = (string: string) => {
  const split = string.toLowerCase().split(' ');
  for (let i = 0; i < split.length; i++) {
    split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
  }
  return split.join(' ');
};
const removeSnakeCase = (string: string) => {
  if (string.indexOf('_') > 0) {
    const newString = string.replace(/_/g, ' ');
    const noDoubleSpaces = newString.replace(/\s+/g, ' ').trim();
    return noDoubleSpaces;
  } else {
    return string;
  }
};
export const snakeToTitle = (string: string) => {
  const noCase = removeSnakeCase(string);
  const titleCase = toTitleCase(noCase);
  return titleCase;
};
