import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/users.module';
import { AccountModule } from './accounts/accounts.module';
import { TransactionModule } from './transactions/transactions.module';

@Module({
  imports: [PrismaModule, UserModule, AccountModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
