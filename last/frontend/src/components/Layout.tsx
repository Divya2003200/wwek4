
import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;