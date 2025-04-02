import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LearnersModule } from './learners/learners.module';
import { CoachesModule } from './coaches/coaches.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReferentialsModule } from './referentials/referentials.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ModulesModule } from './modules/modules.module';
import { EventsModule } from './events/events.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    LearnersModule,
    CoachesModule,
    PromotionsModule,
    ReferentialsModule,
    AttendanceModule,
    ModulesModule,
    EventsModule,
    CloudinaryModule,
    MealsModule,
  ],
})
export class AppModule {}