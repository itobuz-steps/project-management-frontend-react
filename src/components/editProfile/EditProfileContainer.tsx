import { Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { EditProfileForm } from './editProfileForm';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import { config } from '../../config/config';

export default function EditProfileContainer() {
  const [profileImage, setProfileImage] = useState('/profile.png');
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);
  const [loadingNotification, setLoadingNotification] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      const response = await userService.getUserInfo();
      console.log(response);

      if (response.result.profileImage) {
        setProfileImage(
          `${config.api_base_url}/uploads/` + response.result.profileImage
        );
      }
      setEmail(response.result.email);
      setUsername(response.result.name);
      setNotificationEnabled(response.result.notificationPreferences);
    }

    fetchUserData();
  }, []);

  const handleNotificationToggle = async (checked: boolean) => {
    const previous = notificationEnabled;
    setLoadingNotification(true);

    try {
      const response = await userService.updateUserProfile({
        notificationPreferences: checked,
      });

      setNotificationEnabled(response.result.notificationPreferences);

      message.success('Notification preference updated');
    } catch {
      setNotificationEnabled(previous);
      message.error('Failed to update notification preference');
    } finally {
      setLoadingNotification(false);
    }
  };

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
      <div className="mb-4 flex items-center justify-between px-4">
        <span className="font-medium text-gray-600">Push Notifications</span>
        <Switch
          checked={notificationEnabled}
          loading={loadingNotification}
          onChange={handleNotificationToggle}
        />
      </div>
      <EditProfileForm
        setSelectedFile={setProfileImage}
        initialUsername={username}
      />
      <Link
        to={'/for-you'}
        id="profile-go-back-btn"
        className="text-primary-400 hover:text-primary-500 text-center font-semibold transition-colors duration-300"
      >
        ← Go back
      </Link>
    </div>
  );
}
