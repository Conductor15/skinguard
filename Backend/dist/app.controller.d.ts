import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
export declare class AppController {
    private readonly appService;
    private readonly configservice;
    constructor(appService: AppService, configservice: ConfigService);
    getHello(): {
        message: string;
        title: string;
    };
    handlePost(body: any): {
        message: string;
        data: any;
        timestamp: string;
    };
}
