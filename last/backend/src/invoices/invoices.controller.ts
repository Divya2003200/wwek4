// src/invoices/invoices.controller.ts
import {
    Controller, Post, Patch, Get,
    Body, Param, UseGuards
  } from '@nestjs/common';
  import { InvoicesService } from './invoices.service';
  import { CreateInvoiceDto } from './dto/create-invoice.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/Decorators/roles.decorator';
  import { RoleType } from '../common/role.entity';
  
  @Controller()
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class InvoicesController {
    constructor(private inv: InvoicesService) {}
  
    @Post('milestones/:milestoneId/invoices')
    @Roles(RoleType.CLIENT)
    create(@Body() dto: CreateInvoiceDto) {
      return this.inv.create(dto);
    }
  
    @Patch('invoices/:id/pay')
    @Roles(RoleType.CLIENT)
    markPaid(@Param('id') id: string) {
      return this.inv.markPaid(+id);
    }
  
    @Get('projects/:projectId/invoices')
    @Roles(RoleType.CLIENT, RoleType.FREELANCER)
    findByProject(@Param('projectId') pid: string) {
      return this.inv.findByProject(+pid);
    }
  }
  