import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TimerService {
  private timer: NodeJS.Timeout | null = null;
  private remainingTime: number = 0;
  private isRunning: boolean = false;
  private workTime: number = 25 * 60; // 25 minutes in seconds
  private breakTime: number = 5 * 60; // 5 minutes in seconds
  private isBreak: boolean = false;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  startTimer(duration: number = this.workTime, isBreak: boolean = false) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.remainingTime = duration;
    this.isBreak = isBreak;

    this.timer = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        this.stopTimer();
        this.eventEmitter.emit('timer.complete', { isBreak: this.isBreak });

        if (!this.isBreak) {
          this.startBreakTimer();
        }
      } else {
        this.eventEmitter.emit('timer.tick', {
          remainingTime: this.remainingTime,
          isBreak: this.isBreak,
        });
      }
    }, 1000);
  }

  startBreakTimer() {
    this.startTimer(this.breakTime, true);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  pauseTimer() {
    this.stopTimer();
  }

  resumeTimer() {
    if (!this.isRunning && this.remainingTime > 0) {
      this.startTimer(this.remainingTime, this.isBreak);
    }
  }

  getStatus() {
    return {
      remainingTime: this.remainingTime,
      isRunning: this.isRunning,
      isBreak: this.isBreak,
      workTime: this.workTime,
      breakTime: this.breakTime,
    };
  }

  resetTimer() {
    this.stopTimer();
    this.remainingTime = this.workTime;
    this.isBreak = false;
  }

  setWorkTime(minutes: number) {
    this.workTime = minutes * 60;
    if (!this.isRunning && !this.isBreak) {
      this.remainingTime = this.workTime;
    }
  }

  setBreakTime(minutes: number) {
    this.breakTime = minutes * 60;
    if (!this.isRunning && this.isBreak) {
      this.remainingTime = this.breakTime;
    }
  }
}
