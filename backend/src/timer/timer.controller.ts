import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TimerService } from './timer.service';

@Controller('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post('start')
  startTimer(@Body('duration') duration?: number) {
    this.timerService.startTimer(duration);
    return { message: 'Timer started' };
  }

  @Post('stop')
  stopTimer() {
    this.timerService.stopTimer();
    return { message: 'Timer stopped' };
  }

  @Post('pause')
  pauseTimer() {
    this.timerService.pauseTimer();
    return { message: 'Timer paused' };
  }

  @Post('resume')
  resumeTimer() {
    this.timerService.resumeTimer();
    return { message: 'Timer resumed' };
  }

  @Post('reset')
  resetTimer() {
    this.timerService.resetTimer();
    return { message: 'Timer reset' };
  }

  @Get('status')
  getStatus() {
    return this.timerService.getStatus();
  }

  @Post('config/work')
  setWorkTime(@Body('minutes') minutes: number) {
    this.timerService.setWorkTime(minutes);
    return { message: 'Work time updated' };
  }

  @Post('config/break')
  setBreakTime(@Body('minutes') minutes: number) {
    this.timerService.setBreakTime(minutes);
    return { message: 'Break time updated' };
  }
}
