import { Module } from '@nestjs/common';
import { AccountService } from './accounts.service';
import { AccountController } from './accounts.controller';

@Module({
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
