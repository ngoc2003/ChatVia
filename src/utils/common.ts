import { UserType } from "@typing/common";
import axios from "axios";
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

export const isSpecialText = (str: string) => {
  const urlRegex = /^[> ]/;

  return urlRegex.test(str);
};

export const handleFormatContactListUser = (input: UserType[]) => {
  if (!input) {
    return null;
  }
  const separatedNames = {};

  for (const user of input) {
    const arrayOfName = user.username.split(" ");
    const lastWord = arrayOfName?.[arrayOfName?.length - 1];
    const firstChar = lastWord?.charAt(0)?.toUpperCase() as string;

    if (!separatedNames[firstChar]) {
      separatedNames[firstChar] = [];
    }

    separatedNames[firstChar].push(user);
  }

  const result = Object.entries(separatedNames)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([character, names]) => ({ character, names }));

  return result;
};

export const handleUploadImage = (e: any, func1: any, func2?: any) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800; // Maximum width for the resized image
      const MAX_HEIGHT = 600; // Maximum height for the resized image
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });

            const bodyFormData = new FormData();
            bodyFormData.append("image", resizedFile);
            const response = await axios({
              method: "POST",
              url: publicRuntimeConfig.IMGBB_API,
              data: bodyFormData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            func1(response.data.data.url);
            if (func2) {
              func2(response.data.data.url);
            }
          }
        }, file.type);
      }
    };
    if (typeof event?.target?.result === "string") {
      image.src = event.target.result;
    }
  };
  reader.readAsDataURL(file);
};
