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
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('promotions')
@Controller('promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Créer une nouvelle promotion' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Promotion créée' })
  async create(@Body() data: any) {
    return this.promotionsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les promotions' })
  async findAll() {
    return this.promotionsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer la promotion active' })
  async getActivePromotion() {
    return this.promotionsService.getActivePromotion();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une promotion par ID' })
  async findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Récupérer les statistiques d\'une promotion' })
  async getStatistics(@Param('id') id: string) {
    return this.promotionsService.getStatistics(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour une promotion' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.promotionsService.update(id, data);
  }
}