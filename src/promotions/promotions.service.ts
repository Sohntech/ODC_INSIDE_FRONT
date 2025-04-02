import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Promotion, PromotionStatus } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    startDate: Date;
    endDate: Date;
    photoUrl?: string;
  }): Promise<Promotion> {
    const activePromotion = await this.prisma.promotion.findFirst({
      where: { status: PromotionStatus.ACTIVE },
    });

    if (activePromotion) {
      throw new ConflictException('Une promotion active existe déjà');
    }

    return this.prisma.promotion.create({
      data: {
        ...data,
        status: PromotionStatus.ACTIVE,
      },
    });
  }

  async findAll(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      include: {
        learners: true,
        referentials: true,
      },
    });
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        learners: true,
        referentials: true,
        events: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion non trouvée');
    }

    return promotion;
  }

  async update(id: string, data: Partial<Promotion>): Promise<Promotion> {
    const promotion = await this.findOne(id);

    if (data.status === PromotionStatus.ACTIVE) {
      const activePromotion = await this.prisma.promotion.findFirst({
        where: {
          status: PromotionStatus.ACTIVE,
          id: { not: id },
        },
      });

      if (activePromotion) {
        throw new ConflictException('Une autre promotion est déjà active');
      }
    }

    return this.prisma.promotion.update({
      where: { id },
      data,
      include: {
        learners: true,
        referentials: true,
      },
    });
  }

  async getActivePromotion(): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findFirst({
      where: { status: PromotionStatus.ACTIVE },
      include: {
        learners: true,
        referentials: true,
        events: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException('Aucune promotion active trouvée');
    }

    return promotion;
  }

  async getStatistics(id: string) {
    const promotion = await this.findOne(id);
    const learners = await this.prisma.learner.findMany({
      where: { promotionId: id },
    });

    const totalLearners = learners.length;
    const femaleLearners = learners.filter(l => l.gender === 'FEMALE').length;
    const feminizationRate = totalLearners > 0 ? (femaleLearners / totalLearners) * 100 : 0;

    const activeModules = await this.prisma.module.count({
      where: {
        referential: {
          promotionId: id,
        },
        endDate: {
          gte: new Date(),
        },
        startDate: {
          lte: new Date(),
        },
      },
    });

    const upcomingEvents = await this.prisma.event.count({
      where: {
        promotionId: id,
        startDate: {
          gte: new Date(),
        },
      },
    });

    return {
      totalLearners,
      feminizationRate,
      activeModules,
      upcomingEvents,
    };
  }
}