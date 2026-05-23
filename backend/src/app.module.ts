import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TimerModule } from './timer/timer.module';
import { SeederModule } from './seeder/seeder.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SessionsModule } from './sessions/sessions.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TasksModule,
    TimerModule,
    SeederModule,
    PlaylistModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
