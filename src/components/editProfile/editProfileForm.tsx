import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import userService from '../../services/userService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { formErrorHandler } from '../../utils/formErrorHandler';

interface IEditProfileInput {
  username: string;
  profileImage: FileList;
}

export function EditProfileForm({
  setSelectedFile,
  initialUsername,
}: {
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  initialUsername?: string;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IEditProfileInput>({ mode: 'onChange' });

  useEffect(() => {
    if (initialUsername) {
      setValue('username', initialUsername);
    }
  }, [initialUsername, setValue]);

  const submitHandler = async (data: IEditProfileInput) => {
    try {
      await userService.updateUserProfile({
        name: data.username,
        profileImage: data.profileImage[0],
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Profile update failed: ' +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler, formErrorHandler)}
      id="edit-profile-form"
      encType="multipart/form-data"
      className="m-5 flex flex-col items-center justify-center gap-4"
    >
      <div className="align-center flex w-full flex-col justify-center">
        <label
          htmlFor="user_name"
          className="from-label text-primary-400 mb-1 font-semibold"
        >
          Username
        </label>
        <Input
          type="text"
          placeholder="Username"
          {...register('username', { required: 'Username is required' })}
        />
      </div>
      <div className="align-center flex w-full flex-col justify-center">
        <label
          htmlFor="profileImage"
          className="form-label text-primary-400 mb-1 font-semibold"
        >
          Upload Profile Image
        </label>
        <input
          className="form-control file:bg-primary-400 hover:border-primary-400 focus:border-primary-400 w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 text-gray-400 shadow-xs transition-all duration-200 outline-none file:mr-4 file:cursor-pointer file:rounded-md file:border-none file:px-4 file:py-1 file:font-medium file:text-white"
          type="file"
          accept="image/*"
          {...register('profileImage', {
            onChange: (e) => {
              if (e.target.files && e.target.files.length > 0)
                setSelectedFile(URL.createObjectURL(e.target.files[0]));
            },
          })}
        />
      </div>
      <label
        htmlFor="profile_image"
        className="form-label -mt-3 mb-3 self-start text-xs text-gray-400 before:text-sm before:text-red-500 before:content-['*']"
      >
        max 500KB
      </label>
      {errors.username && (
        <p className="text-sm text-red-500">Username is invalid.</p>
      )}
      {errors.profileImage && (
        <p className="text-sm text-red-500">Profile image is invalid.</p>
      )}
      <button
        type="submit"
        className="btn btn-primary bg-primary-500 hover:bg-primary-600 w-full rounded-lg py-2 font-medium text-white transition-all duration-300"
      >
        Save
      </button>
    </form>
  );
}
