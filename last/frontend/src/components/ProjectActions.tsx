
import axios from 'axios';
import { Project } from '../types/project';

const API_URL = 'http://localhost:3000/api/projects';

export const fetchMyProjects = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch your projects');
  }
};

export const fetchProjectDetails = async (id: number, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch project details');
  }
};

export const updateProject = async (
  projectId: number,
  updatedFields: Partial<Project>,
  token: string
) => {
  try {
    const response = await axios.patch(`${API_URL}/${projectId}`, updatedFields, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Failed to update project');
  }
};

export const deleteProject = async (projectId: number, token: string) => {
  try {
    await axios.delete(`${API_URL}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error('Failed to delete project');
  }
};

export const assignFreelancer = async (
  projectId: number,
  freelancerId: number | string,
  token: string
) => {
  try {
    await axios.patch(
      `${API_URL}/${projectId}/assign`,
      { freelancerId: Number(freelancerId) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    throw new Error('Failed to assign freelancer');
  }
};





export const fetchFreelancerProjects = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/freelancer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     

   
    return response.data;
  } catch (err) {
  
    if (err) {
      console.log("Token being passed:", token);
  
      throw new Error(`Error: ${err}`);
    } else {
  
      throw new Error('Network error or server is not responding');
    }
  }
};

;
