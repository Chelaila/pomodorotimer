import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistItem } from './entities/playlist-item.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistItem)
    private readonly repo: Repository<PlaylistItem>,
  ) {}

  findAll(): Promise<PlaylistItem[]> {
    return this.repo.find({ order: { position: 'ASC' } });
  }

  async addOrUpdate(dto: Partial<PlaylistItem>): Promise<PlaylistItem> {
    const existing = await this.repo.findOne({ where: { videoId: dto.videoId } });
    if (existing) {
      return this.repo.save({ ...existing, ...dto });
    }
    const maxPos = await this.repo.maximum('position') ?? -1;
    return this.repo.save({ ...dto, position: (maxPos as number) + 1 });
  }

  async patch(videoId: string, dto: Partial<PlaylistItem>): Promise<PlaylistItem | null> {
    const item = await this.repo.findOne({ where: { videoId } });
    if (!item) return null;
    return this.repo.save({ ...item, ...dto, videoId });
  }

  async remove(videoId: string): Promise<void> {
    await this.repo.delete({ videoId });
  }

  async replaceAll(items: Partial<PlaylistItem>[]): Promise<PlaylistItem[]> {
    await this.repo.clear();
    const toSave = items.map((item, index) => ({ ...item, position: index }));
    return this.repo.save(toSave);
  }
}
