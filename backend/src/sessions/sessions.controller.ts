import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SessionsService, SessionWithTasks } from './sessions.service';
import { Session } from './entities/session.entity';

@Controller('api/sessions')
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Get()
  findAll(): Promise<SessionWithTasks[]> {
    return this.service.findAll();
  }

  @Get('active')
  findActive(): Promise<SessionWithTasks | null> {
    return this.service.findActive();
  }

  @Post()
  create(@Body() body: { name?: string }): Promise<Session> {
    return this.service.create(body?.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
