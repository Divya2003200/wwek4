
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ClientDashboardTabs from './clientDashboard';
import FreelancerDashboardTabs from './FreelancerDashboard';


const Dashboard: React.FC = () => {
  const { role } = useAuth();

  if (!role) return null;

  if (role === 'client') return < ClientDashboardTabs/>;
  if (role === 'freelancer') return <FreelancerDashboardTabs />;

  return null;
};

export default Dashboard;
