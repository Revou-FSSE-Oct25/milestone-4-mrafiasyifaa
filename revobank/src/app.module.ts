import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [PrismaModule, UserModule, AccountModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
