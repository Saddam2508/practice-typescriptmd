"use client";

import React, { ChangeEvent, MouseEvent, FC, useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hook/hooks";
import {
  fetchBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/features/banner/bannerSlice";
import { toast } from "react-toastify";

const AdminBannerForm: FC = () => {
  const { banners, status, error } = useAppSelector((state) => state.banner);

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [position, setPosition] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [editIndex, setEditIndex] = useState<string>("");

  useEffect(() => {
    dispatch(fetchBanner());
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, checked } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "subTitle") {
      setSubTitle(value);
    } else if (name === "link") {
      setLink(value);
    } else if (name === "position") {
      setPosition(Number(value));
    } else if (name === "isActive") {
      setIsActive(checked);
    } else if (name === "image" && files && files[0]) {
      const file = files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubTitle("");
    setLink("");
    setPosition(0);
    setIsActive(false);
    setImage(null);
    setPreviewImage("");
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fd = new FormData();

    if (title) fd.append("title", title);
    if (subTitle) fd.append("subTitle", subTitle);
    if (link) fd.append("link", link);
    if (position) fd.append("position", position.toString());
    if (isActive) fd.append("isActive", isActive.toString());
    if (image) fd.append("banner", image);
    if (editIndex) {
      dispatch(updateBanner({ id: editIndex, data: fd }))
        .unwrap()
        .then(() => {
          toast.success("Banner update successfully");
          resetForm();
          setEditIndex("");
        })
        .catch(() => toast.error("Banner update failed"));
    } else {
      dispatch(createBanner(fd))
        .unwrap()
        .then(() => {
          toast.success("Banner create successfully");
          resetForm();
        })
        .catch(() => {
          toast.error("Banner create failed");
        });
    }
  };

  const handleEditBanner = (index: string) => {
    const selectedBanner = banners.find((b) => b._id === index);
    if (!selectedBanner) return null;
    setEditIndex(index);
    setTitle(selectedBanner.title ?? "");
    setSubTitle(selectedBanner.subTitle ?? "");
    setLink(selectedBanner.link ?? "");
    setIsActive(selectedBanner.isActive ?? false);
    setPosition(selectedBanner.position ?? 0);
    setPreviewImage(selectedBanner?.image || "");
    setImage(null); // পুরনো ফাইল File অবজেক্ট নয়, তাই null
  };

  const handleRemoveBanner = (index: string) => {
    dispatch(deleteBanner(index))
      .unwrap()
      .then(() => toast.success("Banner delete successfully"))
      .catch(() => toast.error("Banner delete failed"));
  };

  useEffect(() => {
    if (error) {
      setErrorMsg(error);
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 6000);
      return clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen p-6 bg-amber-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Add / Edit Banner
        </h1>
        <div className="space-y-4">
          <div>
            <label className="font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full focus:ring-2 focus: ring-blue-500 focus: outline-none"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              name="subTitle"
              value={subTitle}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full focus:ring-2 focus: ring-blue-500 focus: outline-none"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Link</label>
            <input
              type="url"
              name="link"
              value={link}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full focus:ring-2 focus: ring-blue-500 focus: outline-none"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Position</label>
            <input
              type="number"
              name="position"
              value={position}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full focus:ring-2 focus: ring-blue-500 focus: outline-none"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">isActive</label>
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Select Image</label>
            <div className="flex items-center gap-3 mt-1">
              <label
                htmlFor="imageUpload"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
              >
                Choose file
              </label>
              <input
                type="file"
                name="image"
                id="imageUpload"
                onChange={handleChange}
                className="hidden"
              />

              <span className="text-gray-600 text-sm">
                {image ? image.name : "No file choosen"}
              </span>
              {previewImage && (
                <div className="border p-3 rounded-md bg-gray-50 flex flex-col items-center gap-2">
                  <Image
                    loader={({ src }) => src}
                    src={previewImage}
                    width={100}
                    height={100}
                    alt="image"
                    className=" rounded-md shadow"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreviewImage("");
                    }}
                    className=" bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              )}
              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            </div>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={status === "pending"}
            className="bg-blue-600 hover:bg-amber-500 rounded-md text-center text-white shadow px-4 py-3 cursor-pointer font-semibold disabled:bg-blue-400"
          >
            {status === "pending" ? (
              <span className="animate-spin border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
            ) : editIndex ? (
              "update"
            ) : (
              "Submit"
            )}
          </button>
        </div>
        <div>
          {banners && banners.length > 0 && (
            <table>
              <thead>
                <tr>
                  {[
                    "#",
                    "Title",
                    "Subtitle",
                    "Link",
                    "Position",
                    "Image",
                    "Edit",
                    "Delete",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((b, i) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{i + 1}</td>
                    <td className="px-4 py-2">{b.title}</td>
                    <td className="px-4 py-2">{b.subTitle}</td>
                    <td className="px-4 py-2 text-blue-600 underline">
                      <a href={b.link} target="_blank">
                        {b.link}
                      </a>
                    </td>
                    <td className="px-4 py-2">{b.position}</td>

                    <td className="px-4 py-2">
                      {b.image && (
                        <Image
                          src={b.image}
                          alt="banner"
                          width={70}
                          height={70}
                          className="rounded-md shadow"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditBanner(b._id!)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRemoveBanner(b._id!)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBannerForm;
