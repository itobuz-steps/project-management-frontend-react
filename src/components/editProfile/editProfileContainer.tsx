import { useEffect, useState } from 'react';
import { EditProfileForm } from './editProfileForm';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';

export default function EditProfileContainer() {
  const [profileImage, setProfileImage] = useState('profile.png');
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      const response = await userService.getUserInfo();
      console.log(response);

      if (response.result.profileImage) {
        setProfileImage(
          'http://localhost:3001/uploads/profile/' +
            response.result.profileImage
        );
      }
      setEmail(response.result.email);
      setUsername(response.result.name);
    }

    fetchUserData();
  }, []);

  return (
    <div className="card xs:p-8 align-center xs:rounded-xl xs:h-auto bg-primary-50 flex h-screen w-full max-w-100 flex-col justify-center border border-gray-200 p-4 shadow-md">
      <h3 className="mb-4 text-center text-[28px] font-semibold text-gray-700">
        Edit Profile
      </h3>
      <div className="align-center mb-3 flex justify-center">
        <img
          id="preview"
          src={profileImage}
          alt="Profile Preview"
          className="border-primary-300 aspect-square h-24 w-24 rounded-full border-4 object-cover shadow-md"
        />
      </div>
      {email && (
        <p
          id="user-email"
          className="text-primary-400 mb-4 text-center font-semibold"
        >
          {email}
        </p>
      )}
      <EditProfileForm
        setSelectedFile={setProfileImage}
        initialUsername={username}
      />
      <Link
        to={'/dashboard'}
        id="profile-go-back-btn"
        className="text-primary-400 hover:text-primary-500 text-center font-semibold transition-colors duration-300"
      >
        ← Go back
      </Link>
    </div>
  );
}
