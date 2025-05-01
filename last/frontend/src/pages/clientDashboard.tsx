
import React from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Heading } from '@chakra-ui/react';
import CreateProject from '../components/createProject';
import MyProjects from '@/components/ProjectList';
import Navbar from '@/components/navbar';
import Profile from './Profile';


const ClientDashboardTabs: React.FC = () => {
  return (
    <Box p={4}>
      <Navbar/>
      <Heading mb={4}>Welcome to SkillSync (Client)</Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Create Project</Tab>
          <Tab>My Projects</Tab>
          <Tab>My Profile</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CreateProject />
          </TabPanel>
          <TabPanel>
            <MyProjects/>
          </TabPanel>
          <TabPanel>
            <Profile/>
          </TabPanel>
           </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ClientDashboardTabs;



