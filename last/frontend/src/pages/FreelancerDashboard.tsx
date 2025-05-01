
import React from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Heading } from '@chakra-ui/react';
import ProjectBids from '@/components/bid/projectBids';
import CreateBid from '@/components/bid/createBid';
import Navbar from '@/components/navbar';
import MyProjects from '@/components/ProjectList';
import Profile from './Profile';

const FreelancerDashboardTabs: React.FC = () => {
  return (
    <Box p={4}>
      <Navbar/>
      <Heading mb={4}>Welcome to SkillSync (Freelancer)</Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Available Projects</Tab>
          <Tab>Profile</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <MyProjects />
          </TabPanel>
          <TabPanel>
            <Profile />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FreelancerDashboardTabs;
