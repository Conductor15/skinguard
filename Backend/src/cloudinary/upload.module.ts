import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { CloudinaryService } from "./cloudinary.service";
import { CloudinaryProvider } from "./cloudinary.provider";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    controllers: [UploadController],
    providers: [CloudinaryService, CloudinaryProvider],
    exports: [CloudinaryService],
})
export class UploadModule {}