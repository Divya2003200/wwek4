export interface Invoice {
    id: number;
    paid: boolean;
    milestoneId: number; 
    amount?: number;     
    createdAt?: string;  
  }
  