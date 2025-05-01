



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, VStack, Text } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { Invoice } from '../../types/invoicetypes';

interface InvoiceListProps {
  projectId: number;
}

const InvoiceListFreelancer: React.FC<InvoiceListProps> = ({ projectId }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const auth = useAuth();          
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      
      const token = auth.token ?? localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing. Please log in.');
        return;
      }

      try {
        const response = await axios.get<Invoice[]>(
          `http://localhost:3000/api/projects/${projectId}/invoices`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data)
        setInvoices(response.data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices.');
      }
    };

    fetchInvoices();
  }, [projectId]);     

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      <VStack spacing={4}>
        {invoices.length === 0 && <Text>No invoices yet.</Text>}
        <Text><strong>Invoices</strong></Text>
        {invoices.map(inv => (
          <Box key={inv.id} borderWidth="1px" p={4} borderRadius="lg" w="100%">
            <Text><strong>Invoice ID:</strong> {inv.id}</Text>
            <Text><strong>Title:</strong> {inv.milestone?.title}</Text>
            <Text><strong>Status:</strong> {inv.paid ? 'Paid' : 'Pending'}</Text>
            <Text><strong>CreatedAt:</strong> {inv.milestone?.createdAt}</Text>
            <Text><strong>DueDate:</strong> {inv.milestone?.dueDate}</Text>
            <Text><strong>Amount</strong> {inv.milestone?.amount}</Text>
           
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default InvoiceListFreelancer;




