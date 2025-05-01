

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Invoice } from '@/types/invoicetypes';
import { Spinner, VStack, Box, Text, Button } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth'; 

interface Props { 
  projectId: number; 
}

const InvoiceListClient: React.FC<Props> = ({ projectId }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const { token } = useAuth();
  const auth = useAuth();
 
  const fetchInvoices = async () => {
    const token = auth.token ?? localStorage.getItem('token');
    if (!token) {
      setError('Authorization token is missing. Please log in.');
      return;
    }
  
    setLoading(true);
    try {
      const resp = await axios.get(
        `http://localhost:3000/api/projects/${projectId}/invoices`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // transform here:
      const transformed: Invoice[] = resp.data.map((inv: any) => ({
        id: inv.id,
        issuedAt: inv.issuedAt,
        paid: inv.paid,
        milestoneId: inv.milestone.id,
        amount: Number(inv.milestone.amount),
        createdAt: inv.milestone.createdAt,
      }));
  
      setInvoices(transformed);
    } catch (err: any) {
      setError('Failed to fetch invoices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const markAsPaid = async (invoiceId: number) => {
    const token = auth.token ?? localStorage.getItem('token');
    if (!token) {
      setError('Authorization token is missing. Please log in.');
      return;
    }
  
    try {
      await axios.patch(
        `http://localhost:3000/api/invoices/${invoiceId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInvoices(prev =>
        prev.map(inv =>
          inv.id === invoiceId ? { ...inv, paid: true } : inv
        )
      );
      
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
      setError('Failed to mark invoice as paid.');
    }
  };
  

  useEffect(() => {
    if (projectId) {
      fetchInvoices();
    }
  }, [projectId]);


  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">{error}</Text>; // Display error if any
  if (invoices.length === 0) return <Text>No invoices yet.</Text>;

  return (
    <VStack spacing={4}>
  {invoices.length === 0 && <Text>No invoices yet.</Text>}
  {invoices.map(inv => {
    const m = inv.milestone;            
    return (
      <Box
        key={inv.id}
        borderWidth="1px"
        p={4}
        borderRadius="lg"
        w="100%">


        <Text><strong>Invoice ID:</strong> {inv.id}</Text>
        <Text><strong>Milestone ID:</strong> {inv.milestoneId}</Text>
        <Text><strong>Status:</strong> {inv.paid ? 'Paid' : 'Pending'}</Text>
        <Text><strong>Amount:</strong> ₹{inv.amount}</Text>
        <Text><strong>Amount:</strong> ₹{inv.createdAt}</Text>
        <Text>
          <strong>Invoice Issued:</strong>{' '}
          {new Date(inv.issuedAt).toLocaleDateString()}
        </Text>

        {!inv.paid && (
  <Button type='button'colorScheme="green" size="sm" mt={2} onClick={() => markAsPaid(inv.id)}>
    
    Mark as Paid
  </Button>
)}
      </Box>
    );
  })}
</VStack>

  );
};

export default InvoiceListClient; 