/**
 * Centralized API configuration
 * All API endpoints should use this configuration
 */

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
  analyze: `${API_BASE_URL}/analyze`,
  generateResume: `${API_BASE_URL}/generate-resume`,
  uploadJobDescription: `${API_BASE_URL}/upload-jd`,
  getJobs: `${API_BASE_URL}/jobs`,
  health: `${API_BASE_URL}/health`,
} as const;

export default API_BASE_URL;
