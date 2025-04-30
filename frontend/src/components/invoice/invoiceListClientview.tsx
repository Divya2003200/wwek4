


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Invoice } from '@/types/invoicetypes';
import { Spinner, VStack, Box, Text } from '@chakra-ui/react';

interface Props { projectId: number; }

const InvoiceListClient: React.FC<Props> = ({ projectId }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`http://localhost:3000/api/projects/${projectId}/invoices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setInvoices(resp.data);
    } finally {
      setLoading(false);
    }
  };

  // Re-run whenever projectId changes:
  useEffect(() => {
    if (projectId) {
      fetchInvoices();
    }
  }, [projectId]);

  if (loading) return <Spinner />;
  if (invoices.length === 0) return <Text>No invoices yet.</Text>;

  return (
    <VStack spacing={2}>
      {invoices.map(inv => (
        <Box key={inv.id}>
          <Text><strong>Amount:</strong> ₹{inv.amount}</Text>
          <Text><strong>Status:</strong> {inv.paid ? 'Paid' : 'Pending'}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default InvoiceListClient;

