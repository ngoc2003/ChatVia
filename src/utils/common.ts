export const getLastWordOfString = (str: string) => {
  if (str) {
    const arr = str.split(" ");
    return arr[arr.length - 1];
  }
  return "";
};
