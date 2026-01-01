import {
  createBanner,
  deleteBanner,
  updateBanner,
} from '@/features/banner/bannerSlice';
import { useAppDispatch, useAppSelector } from '@/hook/hooks';
import Image from 'next/image';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AdminBannerForm = () => {
  const dispatch = useAppDispatch();

  const {
    banners,
    fetch,
    create,
    update,
    delete: deleteStatus,
  } = useAppSelector((state) => state.banner);

  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [position, setPosition] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [editIndex, setEditIndex] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');

  interface initialFormState {
    title: string;
    subTitle: string;
    link: string;
    position: number;
    isActive: boolean;
    image: File | null;
  }

  const initialFormData: initialFormState = {
    title: '',
    subTitle: '',
    link: '',
    position: 0,
    isActive: false,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, files, checked } = e.target;
  //   if (name === 'title') {
  //     setTitle(value);
  //   } else if (name === 'subTitle') {
  //     setSubTitle(value);
  //   } else if (name === 'link') {
  //     setLink(value);
  //   } else if (name === 'position') {
  //     setPosition(Number(value));
  //   } else if (name === 'isActive') {
  //     setIsActive(checked);
  //   } else if (name === 'image' && files && files[0]) {
  //     const file = files[0];
  //     setImage(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // };

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked, files } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]:
  //       type === 'checkbox'
  //         ? checked
  //         : type === 'number'
  //         ? Number(value)
  //         : type === 'file'
  //         ? files?.[0] || null
  //         : value,
  //   }));

  //   if (type === 'file' && files?.[0]) {
  //     setPreviewImage(URL.createObjectURL(files[0]));
  //   }
  // };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
          ? files?.[0] || null
          : type === 'number'
          ? Number(value)
          : value,
    }));
    if (type === 'file' && files?.[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
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

    const resetForm = () => {
      setTitle('');
      setSubTitle('');
      setLink('');
      setPosition(0);
      setIsActive(false);
      setImage(null);
    };

    if (editIndex) {
      dispatch(updateBanner({ id: editIndex, data: fd }))
        .unwrap()
        .then(() => {
          toast.success('Banner update Successful');
          setEditIndex('');
          resetForm();
        })
        .catch(() => toast.error('Banner update failed'));
    } else {
      dispatch(createBanner(fd))
        .unwrap()
        .then(() => {
          toast.success('Banner create Successful');
          resetForm();
        })
        .catch(() => toast.error('Banner create failed'));
    }
  };

  const handleEdit = (index: string) => {
    const selectedBanner = banners.find((b) => b._id === index);
    if (!selectedBanner) return null;
    setTitle(selectedBanner?.title || '');
  };

  const handleDelete = (index: string) => {
    dispatch(deleteBanner(index));
  };

  useEffect(() => {
    const error =
      deleteStatus.error || fetch.error || create.error || update.error;

    if (error) {
      setErrMsg(error);

      const timer = setTimeout(() => {
        setErrMsg('');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [deleteStatus.error, fetch.error, create.error, update.error]);

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
        checked={isActive}
        onChange={handleChange}
      />
      <input type="file" name="image" onChange={handleChange} />
      <Image
        loader={({ src }) => src}
        src={previewImage}
        alt="image"
        height={50}
        width={50}
      />
      <button
        onClick={() => {
          setImage(null);
          setPreviewImage('');
        }}
      >
        remove
      </button>

      <button
        onClick={handleSubmit}
        disabled={create.status === 'pending' || update.status === 'pending'}
      >
        {editIndex
          ? update.status === 'pending'
            ? 'Updating...'
            : 'Update'
          : create.status === 'pending'
          ? 'Creating...'
          : 'Create'}
      </button>

      {banners && banners.length > 0 && (
        <table>
          <thead>
            {['id', 'titel'].map((b) => (
              <th key={b}> {b} </th>
            ))}
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
                <td>
                  <button onClick={() => handleDelete(b._id!)}>Delete</button>
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
