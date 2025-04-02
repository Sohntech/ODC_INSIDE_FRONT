import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Learner, LearnerStatus } from '@prisma/client';
import * as QRCode from 'qrcode';

@Injectable()
export class LearnersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    address?: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: Date;
    birthPlace: string;
    phone: string;
    email: string;
    password: string;
    refId: string;
    promotionId: string;
    photoFile?: Express.Multer.File;
    tutor: {
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      address?: string;
    };
  }): Promise<Learner> {
    const existingLearner = await this.prisma.learner.findFirst({
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

    if (existingLearner) {
      throw new ConflictException('Un apprenant avec cet email ou ce téléphone existe déjà');
    }

    let photoUrl: string | undefined;
    if (data.photoFile) {
      const uploadResult = await this.cloudinary.uploadFile(
        data.photoFile,
        'learners',
      );
      photoUrl = uploadResult.url;
    }

    const qrCode = await QRCode.toDataURL(data.email);

    return this.prisma.learner.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        phone: data.phone,
        photoUrl,
        qrCode,
        refId: data.refId,
        promotionId: data.promotionId,
        user: {
          create: {
            email: data.email,
            password: data.password,
            role: 'APPRENANT',
          },
        },
        tutor: {
          create: data.tutor,
        },
        kit: {
          create: {},
        },
      },
      include: {
        user: true,
        tutor: true,
        kit: true,
      },
    });
  }

  async findAll(): Promise<Learner[]> {
    return this.prisma.learner.findMany({
      include: {
        user: true,
        referential: true,
        promotion: true,
        tutor: true,
        kit: true,
        attendances: true,
        grades: true,
      },
    });
  }

  async findOne(id: string): Promise<Learner> {
    const learner = await this.prisma.learner.findUnique({
      where: { id },
      include: {
        user: true,
        referential: true,
        promotion: true,
        tutor: true,
        kit: true,
        attendances: true,
        grades: true,
        documents: true,
      },
    });

    if (!learner) {
      throw new NotFoundException('Apprenant non trouvé');
    }

    return learner;
  }

  async update(id: string, data: Partial<Learner>): Promise<Learner> {
    const learner = await this.findOne(id);

    return this.prisma.learner.update({
      where: { id },
      data,
      include: {
        user: true,
        referential: true,
        promotion: true,
        tutor: true,
        kit: true,
      },
    });
  }

  async updateStatus(id: string, status: LearnerStatus): Promise<Learner> {
    const learner = await this.findOne(id);

    return this.prisma.learner.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        referential: true,
        promotion: true,
      },
    });
  }

  async updateKit(id: string, kitData: {
    laptop?: boolean;
    charger?: boolean;
    bag?: boolean;
    polo?: boolean;
  }): Promise<Learner> {
    const learner = await this.findOne(id);

    return this.prisma.learner.update({
      where: { id },
      data: {
        kit: {
          update: kitData,
        },
      },
      include: {
        kit: true,
      },
    });
  }

  async uploadDocument(
    id: string,
    file: Express.Multer.File,
    type: string,
    name: string,
  ) {
    const learner = await this.findOne(id);
    const uploadResult = await this.cloudinary.uploadFile(file, 'documents');

    return this.prisma.document.create({
      data: {
        name,
        type,
        url: uploadResult.url,
        learnerId: id,
      },
    });
  }

  async getAttendanceStats(id: string) {
    const learner = await this.findOne(id);
    const totalDays = await this.prisma.learnerAttendance.count({
      where: { learnerId: id },
    });
    const presentDays = await this.prisma.learnerAttendance.count({
      where: { learnerId: id, isPresent: true },
    });

    return {
      totalDays,
      presentDays,
      attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
    };
  }
}