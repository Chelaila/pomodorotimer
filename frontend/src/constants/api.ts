export const API_ENDPOINTS = {
  TIMER_CONFIG: '/api/timer-configs',
  TASKS: '/api/tasks',
  YOUTUBE: '/api/youtube'
} as const;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  APPLICATION_JSON: 'application/json'
} as const; 