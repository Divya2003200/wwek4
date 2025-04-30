
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/projects';

const getAuthHeaders = (token: string | null) => ({
  Authorization: `Bearer ${token}`,
});

export const createProject = async (token: string | null, projectData: any) => {
  const response = await axios.post(API_URL, projectData, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const fetchMyProjects = async (token: string | null) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const updateProject = async (token: string | null, projectId: number, projectData: any) => {
  const response = await axios.patch(`${API_URL}/${projectId}`, projectData, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const deleteProject = async (token: string | null, projectId: number) => {
  const response = await axios.delete(`${API_URL}/${projectId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const assignFreelancer = async (token: string | null, projectId: number, freelancerId: number) => {
  const response = await axios.patch(`${API_URL}/${projectId}/assign`, { freelancerId }, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};
