import { createBanner } from '@/features/banner/bannerSlice';
import { useAppDispatch, useAppSelector } from '@/hook/hooks';
import Image from 'next/image';
import React, { ChangeEvent, MouseEvent, FC, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AdminBannerForm: FC = () => {
  const dispatch = useAppDispatch();
  const { banners, status, error } = useAppSelector((state) => state.banner);
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [position, setPosition] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean | null>(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [editIndex, setEditIndex] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, checked } = e.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'subTitle') {
      setSubTitle(value);
    } else if (name === 'link') {
      setLink(value);
    } else if (name === 'position') {
      setPosition(Number(value));
    } else if (name === 'isActive') {
      setIsActive(checked);
    } else if (name === 'image' && files && files[0]) {
      const file = files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubTitle('');
    setLink('');
    setPosition(0);
    setIsActive(false);
    setImage(null);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fd = new FormData();
    if (title) fd.append('title', title);
    if (subTitle) fd.append('subTitle', subTitle);
    if (link) fd.append('link', link);
    if (position) fd.append('position', position.toString());
    if (isActive) fd.append('isActive', isActive.toString());
    if (image) fd.append('image', image);

    if (editIndex) {
    } else {
      dispatch(createBanner(fd))
        .unwrap()
        .then(() => {
          toast.success('Banner create successfully');
          resetForm();
        })
        .catch(() => toast.error('Banner create failed'));
    }
  };

  const handleEdit = (index: string) => {
    const selectedBanner = banners.find((b) => b._id === index);

    if (!selectedBanner) return null;
    setEditIndex(index);
    setTitle(selectedBanner.title ?? '');
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setErrMsg(error);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <input type="text" name="title" value={title} onChange={handleChange} />
      <input
        type="text"
        name="subTitle"
        value={subTitle}
        onChange={handleChange}
      />
      <input type="url" name="link" value={link} onChange={handleChange} />
      <input
        type="number"
        name="position"
        value={position}
        onChange={handleChange}
      />
      <input
        type="checkbox"
        name="isActive"
        checked={false}
        onChange={handleChange}
      />
      <input type="file" name="image" onChange={handleChange} />
      {previewImage && (
        <Image
          loader={({ src }) => src}
          src={previewImage}
          alt="image"
          width={50}
          height={50}
        />
      )}
      <button
        onClick={() => {
          setPreviewImage('');
          setImage(null);
        }}
      >
        Remove
      </button>
      <button onClick={handleSubmit}>{editIndex ? 'update' : 'submit'}</button>
      {banners && banners.length > 0 && (
        <table>
          <thead>
            <tr>
              {['title', 'subTitle'].map((t) => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {banners.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>
                <td>{b.title}</td>
                <td>
                  {b.image && (
                    <Image src={b.image} alt="image" width={50} height={50} />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(b._id!)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBannerForm;
