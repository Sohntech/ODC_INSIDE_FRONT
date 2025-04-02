import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Coach } from '@prisma/client';

@Injectable()
export class CoachesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    password: string;
    refId: string;
    photoFile?: Express.Multer.File;
  }): Promise<Coach> {
    const existingCoach = await this.prisma.coach.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          {
            user: {
              email: data.email,
            },
          },
        ],
      },
    });

    if (existingCoach) {
      throw new ConflictException('Un coach avec cet email ou ce téléphone existe déjà');
    }

    let photoUrl: string | undefined;
    if (data.photoFile) {
      const uploadResult = await this.cloudinary.uploadFile(
        data.photoFile,
        'coaches',
      );
      photoUrl = uploadResult.url;
    }

    return this.prisma.coach.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        photoUrl,
        refId: data.refId,
        user: {
          create: {
            email: data.email,
            password: data.password,
            role: 'COACH',
          },
        },
      },
      include: {
        user: true,
        referential: true,
      },
    });
  }

  async findAll(): Promise<Coach[]> {
    return this.prisma.coach.findMany({
      include: {
        user: true,
        referential: true,
        modules: true,
        attendances: true,
      },
    });
  }

  async findOne(id: string): Promise<Coach> {
    const coach = await this.prisma.coach.findUnique({
      where: { id },
      include: {
        user: true,
        referential: true,
        modules: true,
        attendances: true,
      },
    });

    if (!coach) {
      throw new NotFoundException('Coach non trouvé');
    }

    return coach;
  }

  async update(id: string, data: Partial<Coach>): Promise<Coach> {
    const coach = await this.findOne(id);

    return this.prisma.coach.update({
      where: { id },
      data,
      include: {
        user: true,
        referential: true,
        modules: true,
      },
    });
  }

  async getAttendanceStats(id: string) {
    const coach = await this.findOne(id);
    const totalDays = await this.prisma.coachAttendance.count({
      where: { coachId: id },
    });
    const presentDays = await this.prisma.coachAttendance.count({
      where: { coachId: id, isPresent: true },
    });

    return {
      totalDays,
      presentDays,
      attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
    };
  }
}