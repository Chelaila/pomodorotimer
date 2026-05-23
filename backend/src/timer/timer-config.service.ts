import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimerConfig } from './entities/timer-config.entity';

@Injectable()
export class TimerConfigService {
  constructor(
    @InjectRepository(TimerConfig)
    private timerConfigRepository: Repository<TimerConfig>,
  ) {}

  findAll(): Promise<TimerConfig[]> {
    return this.timerConfigRepository.find();
  }

  async findOne(id: string): Promise<TimerConfig> {
    const config = await this.timerConfigRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`Timer config with ID ${id} not found`);
    }
    return config;
  }

  async getActiveConfig(): Promise<TimerConfig> {
    const config = await this.timerConfigRepository.findOne({ where: { isActive: true } });
    if (!config) {
      throw new NotFoundException('No active timer config found');
    }
    return config;
  }

  create(config: Partial<TimerConfig>): Promise<TimerConfig> {
    const newConfig = this.timerConfigRepository.create(config);
    return this.timerConfigRepository.save(newConfig);
  }

  async update(id: string, config: Partial<TimerConfig>): Promise<TimerConfig> {
    const existingConfig = await this.findOne(id);
    Object.assign(existingConfig, config);
    return this.timerConfigRepository.save(existingConfig);
  }

  async setActive(id: string): Promise<TimerConfig> {
    // Desactivar todas las configuraciones
    await this.timerConfigRepository.update({}, { isActive: false });
    
    // Activar la configuración seleccionada
    const config = await this.findOne(id);
    config.isActive = true;
    return this.timerConfigRepository.save(config);
  }

  async remove(id: string): Promise<void> {
    const result = await this.timerConfigRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Timer config with ID ${id} not found`);
    }
  }
} 