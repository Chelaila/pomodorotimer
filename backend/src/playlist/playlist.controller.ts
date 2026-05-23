import { Controller, Get, Post, Patch, Delete, Put, Body, Param } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistItem } from './entities/playlist-item.entity';

@Controller('api/playlist')
export class PlaylistController {
  constructor(private readonly service: PlaylistService) {}

  @Get()
  findAll(): Promise<PlaylistItem[]> {
    return this.service.findAll();
  }

  @Post()
  addOrUpdate(@Body() dto: Partial<PlaylistItem>): Promise<PlaylistItem> {
    return this.service.addOrUpdate(dto);
  }

  @Patch(':videoId')
  patch(
    @Param('videoId') videoId: string,
    @Body() dto: Partial<PlaylistItem>,
  ): Promise<PlaylistItem | null> {
    return this.service.patch(videoId, dto);
  }

  @Delete(':videoId')
  remove(@Param('videoId') videoId: string): Promise<void> {
    return this.service.remove(videoId);
  }

  @Put()
  replaceAll(@Body() items: Partial<PlaylistItem>[]): Promise<PlaylistItem[]> {
    return this.service.replaceAll(items);
  }
}
