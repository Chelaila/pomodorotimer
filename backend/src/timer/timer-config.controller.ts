import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TimerConfigService } from './timer-config.service';
import { TimerConfig } from './entities/timer-config.entity';

@Controller('api/timer-configs')
export class TimerConfigController {
  constructor(private readonly timerConfigService: TimerConfigService) {}

  @Get()
  findAll(): Promise<TimerConfig[]> {
    return this.timerConfigService.findAll();
  }

  @Get('active')
  getActiveConfig(): Promise<TimerConfig> {
    return this.timerConfigService.getActiveConfig();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TimerConfig> {
    return this.timerConfigService.findOne(id);
  }

  @Post()
  create(@Body() config: Partial<TimerConfig>): Promise<TimerConfig> {
    return this.timerConfigService.create(config);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() config: Partial<TimerConfig>): Promise<TimerConfig> {
    return this.timerConfigService.update(id, config);
  }

  @Put(':id/activate')
  setActive(@Param('id') id: string): Promise<TimerConfig> {
    return this.timerConfigService.setActive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.timerConfigService.remove(id);
  }
} 