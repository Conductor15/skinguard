export const AUTH_CONSTANTS = {
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
  },
  TOKEN_TYPES: {
    BEARER: 'Bearer',
  },
  MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    INVALID_CREDENTIALS: 'Invalid credentials',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token, please login again',
    AUTHENTICATION_FAILED: 'Authentication failed',
  },
  COOKIE_OPTIONS: {
    HTTP_ONLY: true,
  },
};

export enum UserType {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}
