import { Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { EditProfileForm } from './editProfileForm';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';

export default function EditProfileContainer() {
  const [profileImage, setProfileImage] = useState('/profile.png');
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    inApp: true,
  });
  const [loadingNotification, setLoadingNotification] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      const response = await userService.getUserInfo();
      console.log(response);

      if (response.result.profileImage) {
        setProfileImage(response.result.profileImage);
      }
      setEmail(response.result.email);
      setUsername(response.result.name);
      setNotifications({
        push: response.result.notificationPreferences?.push ?? true,
        email: response.result.notificationPreferences?.email ?? true,
        inApp: response.result.notificationPreferences?.inApp ?? true,
      });
    }

    fetchUserData();
  }, []);

  const handleNotificationToggle = async (
    type: 'push' | 'email' | 'inApp',
    checked: boolean
  ) => {
    const previous = { ...notifications };

    setNotifications((prev) => ({
      ...prev,
      [type]: checked,
    }));

    setLoadingNotification(true);

    try {
      const response = await userService.updateUserProfile({
        [type]: checked,
      });

      setNotifications(response.result.notificationPreferences);

      message.success('Notification preference updated');
    } catch {
      setNotifications(previous);
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
      <div className="mb-4 space-y-3 px-4">
        {/* 🔔 Push */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600">Push Notifications</span>
          <Switch
            className="custom-switch"
            checked={notifications.push}
            loading={loadingNotification}
            onChange={(checked) => handleNotificationToggle('push', checked)}
          />
        </div>

        {/* 📧 Email */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600">Email Notifications</span>
          <Switch
            className="custom-switch"
            checked={notifications.email}
            loading={loadingNotification}
            onChange={(checked) => handleNotificationToggle('email', checked)}
          />
        </div>

        {/* 🖥️ In-App */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600">
            In-App Notifications
          </span>
          <Switch
            className="custom-switch"
            checked={notifications.inApp}
            loading={loadingNotification}
            onChange={(checked) => handleNotificationToggle('inApp', checked)}
          />
        </div>
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
