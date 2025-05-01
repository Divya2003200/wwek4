import { Milestone } from "./milestonetypes";

export interface Invoice {
    issuedAt: any;
    id: number;
    paid: boolean;
    milestoneId: number; 
    amount?: number;     
    createdAt?: string;  
    milestone?:Milestone
  }
