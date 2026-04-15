import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AccountController } from './account/account.controller';
import { TransactionController } from './transaction/transaction.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, AccountController, TransactionController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
