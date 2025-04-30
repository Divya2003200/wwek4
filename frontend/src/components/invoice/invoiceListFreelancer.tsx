

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
  const token = auth.token ?? localStorage.getItem('token') ?? '';

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get<Invoice[]>(
          `http://localhost:3000/api/projects/${projectId}/invoices`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    if (token) {
      fetchInvoices();
    }
  }, [projectId, token]);

  return (
    <Box>
      <VStack spacing={4}>
        {invoices.map((invoice) => (
          <Box key={invoice.id} borderWidth="1px" p={4} borderRadius="lg">
            <Text><strong>Invoice ID:</strong> {invoice.id}</Text>
            <Text><strong>Status:</strong> {invoice.paid ? 'Paid' : 'Pending'}</Text>
            {invoice.amount !== undefined && (
              <Text><strong>Amount:</strong> ₹{invoice.amount}</Text>
            )}
            {invoice.createdAt && (
              <Text><strong>Created At:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</Text>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default InvoiceListFreelancer;
