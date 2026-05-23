import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerConfigController } from './timer-config.controller';
import { TimerConfigService } from './timer-config.service';
import { TimerConfig } from './entities/timer-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimerConfig])],
  controllers: [TimerConfigController],
  providers: [TimerConfigService],
  exports: [TimerConfigService],
})
export class TimerModule {}
