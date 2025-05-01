// // src/invoices/dto/create-invoice.dto.ts
// import { IsNotEmpty, IsNumber } from 'class-validator';

// export class CreateInvoiceDto {
//   @IsNotEmpty() @IsNumber() milestoneId: number;
// }

import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty() @IsNumber() milestoneId: number;
  @IsNotEmpty() @IsNumber() amount: number;
  @IsNotEmpty() @IsDateString() dueDate: string; // Assuming the date format is ISO string
}

