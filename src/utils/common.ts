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
  reader.onload = handleImageLoad;
  reader.readAsDataURL(file);

  function handleImageLoad(event: any) {
    const image = new Image();
    image.onload = handleImageResize;
    if (typeof event?.target?.result === "string") {
      image.src = event.target.result;
    }
  }

  function handleImageResize() {
    const MAX_WIDTH = 800; // Maximum width for the resized image
    const MAX_HEIGHT = 600; // Maximum height for the resized image
    let width = this.width;
    let height = this.height;

    if (width > height && width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    } else if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(this, 0, 0, width, height);

      const promise = new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob."));
          }
        }, file.type);
      });

      promise
        .then(async (blob: any) => {
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
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function createCanvas(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
};
