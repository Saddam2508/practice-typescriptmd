"use client";

import React, { ChangeEvent, FC, useState } from "react";
import Image from "next/image";

const AdminBannerForm: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "link") {
      setLink(value);
    } else if (name === "image" && files && files[0]) {
      const file = files[0];
      setImage(file);
      setPreviewImage(file); // preview-এর জন্য
    }
  };

  return (
    <div>
      <h1>Title :</h1>
      <input
        type="text"
        name="title"
        value={title}
        placeholder="Enter a title"
        onChange={handleChange}
        className="border"
      />
      <h1>Link :</h1>
      <input
        type="text"
        name="link"
        value={link}
        placeholder="Enter a link"
        onChange={handleChange}
        className="border"
      />
      <h1>Select image :</h1>
      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="border"
      />
      {previewImage && (
        <div className="mt-2">
          <p>Preview:</p>
          <Image
            loader={({ src }) => src}
            src={URL.createObjectURL(previewImage)}
            alt="Preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover border"
          />
          <button
            type="button"
            className="bg-red-500 text-white rounded"
            onClick={() => {
              setPreviewImage(null);
              setImage(null); // optional: original file remove
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBannerForm;
