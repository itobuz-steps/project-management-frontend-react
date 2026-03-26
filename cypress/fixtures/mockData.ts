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

// Forgot Password mock data
export const otpSentSuccess = {
  statusCode: 200,
  body: {
    message: 'OTP sent successfully',
  },
};

export const otpSendFailure = {
  statusCode: 500,
  body: {
    message: 'Failed to send otp',
  },
};

export const passwordResetSuccess = {
  statusCode: 200,
  body: {
    message: 'Password reset successful',
    result: {
      email: 'test@example.com',
    },
  },
};

export const invalidOtpError = {
  statusCode: 400,
  body: {
    message: 'Invalid OTP',
  },
};

export const passwordResetFailure = {
  statusCode: 500,
  body: {
    message: 'Password reset failed',
  },
};
