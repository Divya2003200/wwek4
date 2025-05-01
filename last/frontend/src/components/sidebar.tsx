
import { Box, VStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const Sidebar = () => {
  const { role, clearToken } = useAuth();
  const navigate = useNavigate();

  const commonLinks = [
    { label: 'Profile', path: '/profile' },
  ];

  const clientLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Create Project', path: '/projects/create' },
  ];

  const freelancerLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Browse Projects', path: '/projects' },
  ];

  const links = role === 'client' ? clientLinks : freelancerLinks;

  return (
    <Box width="200px" p={4} bg="gray.100" height="100vh">
      <VStack align="stretch" spacing={4}>
        {links.concat(commonLinks).map((link) => (
          <Button
            key={link.path}
            variant="ghost"
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </Button>
        ))}
        <Button colorScheme="red" onClick={clearToken}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
