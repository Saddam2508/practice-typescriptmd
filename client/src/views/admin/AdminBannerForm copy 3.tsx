"use client";

import React, { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import {
  createBanner,
  updateBanner,
  fetchBanner,
  resetBanner,
} from "@/features/banner/bannerSlice";
import { Banner } from "@/features/banner/bannerTypes";
import { useAppDispatch, useAppSelector } from "@/hook/hooks";

const AdminBannerForm: FC = () => {
  const { banners, status, error } = useAppSelector((state) => state.banner);
  const dispatch = useAppDispatch();

  const [title, setTile] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "title") {
      setTile(value);
    } else if (name === "link") {
      setLink(value);
    } else if (name === "image" && files && files[0]) {
      const file = files[0];
      setImage(file);
      setPreviewImage(file);
    }
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fd = new FormData();
    if (title) fd.append("title", title);
    if (link) fd.append("link", link);
    if (image) fd.append("image", image);
    dispatch(createBanner(fd))
      .unwrap()
      .then(() => {
        toast.success("banner create successfully");
        setTile("");
        setLink("");
        setImage(null);
        setPreviewImage(null);
      })

      .catch(() => toast.error("banner create failed"));
  };

  useEffect(() => {
    if (error) {
      setErrorMsg(error);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  }, [error]);

  if (status === "pending") return <p>Loading......</p>;

  return (
    <div className="mt-6 bg-amber-50">
      <h1>Title:</h1>
      <input
        type="text"
        name="title"
        value={title}
        onChange={handleChange}
        className="border"
      />
      <h1>Link</h1>
      <input
        type="text"
        name="link"
        value={link}
        onChange={handleChange}
        className="border"
      />
      <h1>Select Image</h1>
      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="border"
      />
      {previewImage && (
        <div>
          <p>preview</p>
          <Image
            loader={({ src }) => src}
            src={URL.createObjectURL(previewImage)}
            alt="preview"
            width={50}
            height={50}
          />
          <button
            onClick={() => {
              setPreviewImage(null);
              setImage(null);
            }}
            className="bg-red-400 hover:text-white"
          >
            Remove
          </button>
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>
      {errorMsg && <p className="text-red-400">{errorMsg}</p>}
    </div>
  );
};

export default AdminBannerForm;
