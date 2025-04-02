import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReferentialsService } from './referentials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('referentials')
@Controller('referentials')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReferentialsController {
  constructor(private readonly referentialsService: ReferentialsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau référentiel' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Référentiel créé' })
  async create(@Body() data: any) {
    return this.referentialsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les référentiels' })
  async findAll() {
    return this.referentialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un référentiel par ID' })
  async findOne(@Param('id') id: string) {
    return this.referentialsService.findOne(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Récupérer les statistiques d\'un référentiel' })
  async getStatistics(@Param('id') id: string) {
    return this.referentialsService.getStatistics(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un référentiel' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.referentialsService.update(id, data);
  }
}