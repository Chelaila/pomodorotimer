import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistItem } from './entities/playlist-item.entity';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistItem])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
