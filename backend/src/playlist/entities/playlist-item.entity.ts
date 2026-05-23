import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('playlist_items')
export class PlaylistItem {
  @PrimaryColumn({ length: 20 })
  videoId: string;

  @Column({ length: 500, default: '' })
  title: string;

  @Column({ length: 500, default: '' })
  thumbnail: string;

  @Column({ length: 20, default: '' })
  duration: string;

  @Column({ default: 0 })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
