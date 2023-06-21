import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const getLastWordOfString = (str: string) => {
  if (str) {
    const arr = str.split(" ");
    return arr[arr.length - 1];
  }
  return "";
};

export const isImageLink = (link: string) => {
  const domains = publicRuntimeConfig.IMAGES.split(",");
  const url = new URL(link);

  return domains.some((domain: string) => url.hostname.includes(domain));
};
