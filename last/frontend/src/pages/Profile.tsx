

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const auth = useAuth();
  const toast = useToast();
  const token = auth.token ?? localStorage.getItem('token')?.trim() ?? null;

  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);  

  // Fetch the profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const formik = useFormik({
    initialValues: {
      name: profileData?.name || '',
      bio: profileData?.bio || '',
    },
    enableReinitialize: true, // Allow initial values to be updated with fetched data
    onSubmit: async (values) => {
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in to update your profile.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
  
      try {
        let uploadedImageUrl = '';
  
       
        if (image) {
          const formData = new FormData();
          formData.append('file', image);
  
          const uploadRes = await axios.post('http://localhost:3000/api/users/me', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          uploadedImageUrl = uploadRes.data.url;
        }
  
     
        const updateProfileRes = await axios.patch(
          'http://localhost:3000/api/users/me',
          {
            name: values.name,
            bio: values.bio,
            profileImage: uploadedImageUrl || '',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
       
        setProfileData((prevData: any) => ({
          ...prevData,
          name: values.name,
          bio: values.bio,
          profileImage: uploadedImageUrl || prevData.profileImage,
        }));
  
        toast({
          title: 'Success',
          description: 'Profile updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
   
        setImage(null);
        setPreview(null);
        setIsEditing(false); 
      } catch (error: any) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Error updating profile',
          description: error.response?.data?.message || 'Something went wrong.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });
  
  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      {/* Show profile details */}
      {!isEditing && profileData && (
        <>
          <VStack spacing={4} align="start">
            <Image src={profileData.profileImage || 'default-image-url'} alt="Profile Picture" boxSize="100px" />
            <Box>
              <strong>Name: </strong> {profileData.name}
            </Box>
            <Box>
              <strong>Bio: </strong> {profileData.bio}
            </Box>
            <Button colorScheme="teal" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </VStack>
        </>
      )}

      {/* Show the form to update profile */}
      {isEditing && (
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <Image src={preview} alt="Preview" boxSize="100px" mt={2} />
              )}
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Save Profile
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
};

export default Profile;


