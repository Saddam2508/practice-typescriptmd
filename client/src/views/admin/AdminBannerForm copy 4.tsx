"use client";

import React, { ChangeEvent, MouseEvent, FC, useState, useEffect } from "react";
import Image from "next/image";

import {
  fetchBanner,
  createBanner,
  deleteBanner,
  updateBanner,
} from "@/features/banner/bannerSlice";
import { useAppDispatch, useAppSelector } from "@/hook/hooks";
import { toast } from "react-toastify";

const AdminBannerForm: FC = () => {
  const { banners, status, error } = useAppSelector((state) => state.banner);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [editIndex, setEditIndex] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchBanner());
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, checked } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "subtitle") {
      setSubtitle(value);
    } else if (name === "link") {
      setLink(value);
    } else if (name === "isActive") {
      setIsActive(checked);
    } else if (name === "position") {
      const p = Number(value);
      setPosition(p);
    } else if (name === "image" && files && files[0]) {
      const file = files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setLink("");
    setIsActive(false);
    setPosition(0);
    setImage(null);
    setPreviewImage(null);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    if (title) fd.append("title", title);
    if (subtitle) fd.append("subtitle", subtitle);
    if (link) fd.append("link", link);
    if (isActive) fd.append("isActive", isActive.toString());
    if (position) fd.append("position", position.toString());
    if (image) fd.append("banner", image);
    if (editIndex) {
      dispatch(updateBanner({ id: editIndex, data: fd }))
        .unwrap()
        .then(() => {
          toast.success("Banner update successfully");
          resetForm();
          setEditIndex("");
        })
        .catch(() => toast.error("Banner update failed"))
        .finally(() => setLoading(false)); // ← submit শেষ হলে লোডিং বন্ধ
    } else {
      dispatch(createBanner(fd))
        .unwrap()
        .then(() => {
          toast.success("Banner create successfully");
          resetForm();
        })
        .catch(() => toast.error("Banner create failed"))
        .finally(() => setLoading(false)); // ← submit শেষ হলে লোডিং বন্ধ
    }
  };

  const handleEditBanner = (index: string) => {
    const selectedBanner = banners.find((b) => b._id === index);
    if (!selectedBanner) return null;
    setEditIndex(index);
    setTitle(selectedBanner?.title ?? "");
    setSubtitle(selectedBanner.subtitle ?? "");
    setLink(selectedBanner.link ?? "");
    setIsActive(selectedBanner.isActive ?? false);
    setPosition(selectedBanner.position ?? 0);
    setPreviewImage(null);
    setPreviewImage(selectedBanner?.image || null);
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
      const timer = setTimeout(() => setErrorMsg(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="bg-amber-100">
      <div>
        <h2>Title</h2>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          className="border"
        />
        <h2>Subtitle</h2>
        <input
          type="text"
          name="subtitle"
          value={subtitle}
          onChange={handleChange}
          className="border"
        />
        <h2>Link</h2>
        <input
          type="url"
          name="link"
          value={link}
          onChange={handleChange}
          className="border"
        />
        <h2>isActive</h2>
        <input
          type="checkbox"
          name="isActive"
          checked={isActive}
          onChange={handleChange}
        />
        <h2>Position</h2>
        <input
          type="number"
          name="position"
          value={position}
          onChange={handleChange}
          className="border"
        />
        <h2>Select Image</h2>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="border"
        />
        {previewImage && (
          <div>
            <Image
              loader={({ src }) => src}
              src={previewImage}
              alt="preview"
              width={100}
              height={100}
            />
            <button
              onClick={() => {
                setImage(null);
                setPreviewImage(null);
              }}
              className="bg-red-400 hover: text-white"
            >
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-400 text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={loading} // লোডিং চলাকালীন বাটন disable
        >
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
          ) : editIndex ? (
            "Update"
          ) : (
            "Submit"
          )}
        </button>

        {errorMsg && <p className="text-red-400">{errorMsg}</p>}
      </div>
      <div className="overflow-x-auto mt-6">
        {banners && banners.length > 0 && (
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Subtitle
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Link
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Position
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Edit
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((b, i) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{i + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{b.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {b.subtitle}
                  </td>
                  <td className="px-4 py-2 text-sm text-blue-500 underline">
                    <a href={b.link} target="_blank" rel="noopener noreferrer">
                      {b.link}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {b.position}
                  </td>
                  <td className="px-4 py-2">
                    {b.image && (
                      <Image
                        src={b.image}
                        alt="banner"
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    )}
                  </td>
                  {/* ❗ button must be inside <td> */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditBanner(b._id!)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                  {/* ❗ button must be inside <td> */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemoveBanner(b._id!)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
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
  );
};

export default AdminBannerForm;
