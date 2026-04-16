import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [AuthModule]
})
export class TransactionsModule {}
