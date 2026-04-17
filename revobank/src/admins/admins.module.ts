import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService],
  imports: [AuthModule]
})
export class AdminsModule {}
