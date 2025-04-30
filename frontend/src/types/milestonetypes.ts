export interface Milestone {
    id: number;
    title: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'completed';
    projectId: number;
    createdAt: string;
  }
  
  export interface CreateInvoiceFormProps {
    projectId: number;
  }
  