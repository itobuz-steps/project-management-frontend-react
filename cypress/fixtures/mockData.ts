// Mock data for edit profile tests
export const mockUserData = {
  result: {
    email: 'testuser@example.com',
    name: 'Test User',
    profileImage: '/profile.png',
    notificationPreferences: {
      push: true,
      email: true,
      inApp: true,
    },
  },
};

export const updatedUserData = {
  result: {
    email: 'testuser@example.com',
    name: 'Updated User',
    profileImage: '/updated-profile.png',
    notificationPreferences: {
      push: false,
      email: true,
      inApp: false,
    },
  },
};

export const emptyNameUserData = {
  result: {
    email: 'testuser@example.com',
    name: '',
    profileImage: '/profile.png',
    notificationPreferences: {
      push: true,
      email: true,
      inApp: true,
    },
  },
};

export const nullFieldsUserData = {
  result: {
    email: null,
    name: null,
    profileImage: null,
    notificationPreferences: null,
  },
};

export const errorResponses = {
  usernameExists: {
    statusCode: 400,
    body: {
      message: 'Username already exists',
    },
  },
  serverError: {
    statusCode: 500,
    body: {
      message: 'Server error',
    },
  },
  fileSizeExceeded: {
    statusCode: 413,
    body: {
      message: 'File size exceeds 500KB limit',
    },
  },
};
