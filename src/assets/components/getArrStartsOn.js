export const getArrStartsOn = (str, arr) => {
  const pattern = `^${str}`;
  const re = new RegExp(pattern);
  return arr.filter(i=>re.exec(i))
}
