import { Controller, Get, Post, Render, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configservice: ConfigService,
  ) {}

  @Get()
  @Render('home.ejs')
  getHello() {
    return {
      message: this.appService.getHello(),
      title: 'Welcome to NestJS',
    };
    console.log('Config Service:', this.configservice.get<string>("'PORT'"));
  }

  @Post()
  handlePost(@Body() body: any) {
    return {
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString()
    };
  }
}
