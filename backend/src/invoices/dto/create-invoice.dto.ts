// src/invoices/dto/create-invoice.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty() @IsNumber() milestoneId: number;
}
