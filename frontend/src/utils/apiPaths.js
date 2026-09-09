export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
    GET_USER_INFO: `${API_BASE_URL}/api/v1/auth/getUser`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/v1/auth/update`,
  },
  POLLS: {
    CREATE: `${API_BASE_URL}/api/v1/poll/create`,
    GET_ALL: `${API_BASE_URL}/api/v1/poll/getAllPolls`,
    GET_BY_ID: (pollId) => `${API_BASE_URL}/api/v1/poll/${pollId}`,
    VOTE: (pollId) => `${API_BASE_URL}/api/v1/poll/${pollId}/vote`,
    CLOSE: (pollId) => `${API_BASE_URL}/api/v1/poll/${pollId}/close`,
    BOOKMARK: (pollId) => `${API_BASE_URL}/api/v1/poll/${pollId}/bookmark`,
    GET_BOOKMARKED: `${API_BASE_URL}/api/v1/poll/user/bookmarked`,
    VOTED_POLLS: `${API_BASE_URL}/api/v1/poll/votedPolls`,
    DELETE: (pollId) => `${API_BASE_URL}/api/v1/poll/${pollId}/delete`,
  },
  IMAGE: {
    UPLOAD_IMAGE: `${API_BASE_URL}/api/upload`,
  }
};