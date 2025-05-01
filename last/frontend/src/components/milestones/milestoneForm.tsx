import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Button, FormControl, FormLabel,
  Input, VStack, useToast
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

interface MilestoneFormProps {
  projectId: number;
  onComplete: () => void;
}

interface FormValues {
  title: string;
  dueDate: string;
  amount: string;
}

const API_URL = 'http://localhost:3000/api';

const MilestoneForm: React.FC<MilestoneFormProps> = ({ projectId, onComplete }) => {
  const toast = useToast();
  const { token } = useAuth();
  const authToken = token ?? localStorage.getItem('token');

  const formik = useFormik<FormValues>({
    initialValues: { title: '', dueDate: '', amount: '' },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      dueDate: Yup.date().required('Required'),
      amount: Yup.number().positive().required('Required'),
    }),
    onSubmit: async values => {
      try {
        await axios.post(
          `${API_URL}/projects/${projectId}/milestones`,
          {
            title: values.title,
            dueDate: values.dueDate,
            amount: Number(values.amount),
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast({ title: 'Milestone created', status: 'success' });
        onComplete();
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.response?.data?.message || err.message,
          status: 'error'
        });
      }
    }
  });

  return (
    <Box mb={6} p={4} borderWidth="1px" borderRadius="md">
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!formik.errors.title && formik.touched.title}>
            <FormLabel>Title</FormLabel>
            <Input {...formik.getFieldProps('title')} />
          </FormControl>

          <FormControl isInvalid={!!formik.errors.dueDate && formik.touched.dueDate}>
            <FormLabel>Due Date</FormLabel>
            <Input type="date" {...formik.getFieldProps('dueDate')} />
          </FormControl>

          <FormControl isInvalid={!!formik.errors.amount && formik.touched.amount}>
            <FormLabel>Amount (₹)</FormLabel>
            <Input type="number" {...formik.getFieldProps('amount')} />
          </FormControl>

          <Button type="submit" colorScheme="blue" alignSelf="flex-end">
            Create Milestone
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default MilestoneForm;
