
import React, { useState, useEffect } from 'react';
import { useAuth }       from '../context/auth';
import api                from '../api/index';    
import axios              from 'axios';           
import {
  Box, Input, Button, Text, FormControl, FormLabel,
  VStack, useToast, Link,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { setToken, token, role } = useAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState<string | null>(null);

  const toast    = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password }
      );

      if (data.accessToken) {
  
        setToken(data.accessToken);

       
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        toast({ title: 'Login successful', status: 'success', duration: 3000 });

     
        if (data.role === 'client') {
          navigate('/dashboard');
        } else {
          navigate('/freelancer-dashboard');
        }
      }
    } catch {
      setError('Invalid credentials');
    }
  };

  
  useEffect(() => {
    if (location.pathname !== '/login') return;

    if (token && role === 'client') {
      navigate('/dashboard');
    } else if (token && role === 'freelancer') {
      navigate('/freelancer-dashboard');
    }
  }, [token, role, location.pathname, navigate]);



  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Login
          </Button>

          {error && <Text color="red.500">{error}</Text>}

          <Text>
            Don’t have an account?{' '}
            <Link color="blue.500" onClick={() => navigate('/register')}>
              Register
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
