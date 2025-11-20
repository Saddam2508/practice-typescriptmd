"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hook/hooks";
import Image from "next/image";
import {
  createBanner,
  updateBanner,
  fetchBanner,
  resetBanner,
} from "@/features/banner/bannerSlice";
import { toast } from "react-hot-toast";
import { Banner } from "@/features/banner/bannerTypes";

const AdminBannerForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { banners, status, error } = useAppSelector((state) => state.banner);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 ব্যানার লোড
  useEffect(() => {
    dispatch(fetchBanner());
    return () => {
      dispatch(resetBanner());
    };
  }, [dispatch]);

  // 🔹 ব্যানার সেট
  useEffect(() => {
    if (banners) {
      const currentBanner: Banner = Array.isArray(banners)
        ? banners[0]
        : banners;
      if (currentBanner && Object.keys(currentBanner).length > 0) {
        setTitle(currentBanner.title || "");
        setLink(currentBanner.link || "");
        setPreview(currentBanner.image || null);
      } else {
        setTitle("");
        setLink("");
        setPreview(null);
      }
    } else {
      setTitle("");
      setLink("");
      setPreview(null);
    }
  }, [banners]);

  // 🔹 error change হলে toast দেখাও
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // 🔹 ইমেজ preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // 🔹 সাবমিট
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (link) formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      const currentBanner: Banner | null = Array.isArray(banners)
        ? banners[0]
        : banners;

      if (currentBanner && Object.keys(currentBanner).length > 0) {
        // Update
        await dispatch(
          updateBanner({ id: currentBanner._id!.toString(), data: formData })
        ).unwrap();
        toast.success("Banner updated successfully!");
      } else {
        // Create
        await dispatch(createBanner(formData)).unwrap();
        toast.success("Banner created successfully!");
      }

      dispatch(fetchBanner());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed!");
    }
  };

  // 🔹 ব্যানার আছে কি না চেক
  const hasBanner =
    banners &&
    ((Array.isArray(banners) && banners.length > 0) ||
      (!Array.isArray(banners) && Object.keys(banners).length > 0));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {hasBanner ? "Update Banner" : "Create Banner"}
      </h2>

      {error && (
        <div className="text-red-500 text-center mb-3 bg-red-50 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter banner title"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter banner link"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {preview && (
          <div className="mt-3">
            <Image
              src={preview}
              alt="Banner preview"
              width={600}
              height={300}
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={status === "pending"}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {status === "pending"
            ? "Processing..."
            : hasBanner
            ? "Update Banner"
            : "Create Banner"}
        </button>
      </form>
    </div>
  );
};

export default AdminBannerForm;
