
import React from 'react';
import { Box, Button, HStack, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import LogoutButton from './Logout';

const Navbar: React.FC = () => {
  
  return (
    <Box bg="teal.500" px={4} py={2}>
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Link as={RouterLink} to="/dashboard" color="white">
            Dashboard
         </Link>
        </HStack>
      <LogoutButton/>
      </HStack>
    </Box>
  );
};

export default Navbar;