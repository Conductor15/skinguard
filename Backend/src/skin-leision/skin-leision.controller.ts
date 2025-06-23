import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SkinLesionService } from './skin-leision.service';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';

@Controller('skin-leision')
export class SkinLesionController {
  constructor(private readonly skinLesionService: SkinLesionService) {}

  @Post()
  create(@Body() createSkinLesionDto: CreateSkinLesionDto) {
    return this.skinLesionService.create(createSkinLesionDto);
  }

  @Get()
  findAll() {
    return this.skinLesionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skinLesionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkinLesionDto: UpdateSkinLeisionDto,
  ) {
    return this.skinLesionService.update(id, updateSkinLesionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skinLesionService.remove(id);
  }

  // // Endpoint để thêm product vào skin lesion
  // @Post(':skinLesionId/products/:productId')
  // addProductToSkinLesion(
  //   @Param('skinLesionId') skinLesionId: string,
  //   @Param('productId') productId: string,
  // ) {
  //   return this.skinLesionService.addProductToSkinLesion(
  //     skinLesionId,
  //     productId,
  //   );
  // }

  // // Endpoint để xóa product khỏi skin lesion
  // @Delete(':skinLesionId/products/:productId')
  // removeProductFromSkinLesion(
  //   @Param('skinLesionId') skinLesionId: string,
  //   @Param('productId') productId: string,
  // ) {
  //   return this.skinLesionService.removeProductFromSkinLesion(
  //     skinLesionId,
  //     productId,
  //   );
  // }

  // Endpoint để lấy dữ liệu hiển thị
  @Get('display/all')
  findAllForDisplay() {
    return this.skinLesionService.findAllForDisplay();
  }

  // Endpoint để lấy dữ liệu admin
  @Get('admin/all')
  findAllForAdmin() {
    return this.skinLesionService.findAllForAdmin();
  }
}
