import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diagnose, DiagnoseDocument } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

@Injectable()
export class DiagnoseService {
  constructor(
    @InjectModel(Diagnose.name) private diagnoseModel: Model<DiagnoseDocument>,
  ) {}
  /**
   * Kiểm tra xem diagnose_id đã tồn tại hay chưa
   * @param diagnose_id ID cần kiểm tra
   * @returns true nếu chưa tồn tại, false nếu đã tồn tại
   */
  async validateDiagnoseId(diagnose_id: string): Promise<boolean> {
    const existing = await this.diagnoseModel.findOne({ diagnose_id }).exec();
    return !existing; // true nếu chưa tồn tại
  }
  /**
   * Tạo một diagnose mới
   * @param createDiagnoseDto Dữ liệu để tạo diagnose
   * @returns Diagnose đã được tạo
   */
  async create(createDiagnoseDto: CreateDiagnoseDto) {
    // Validate ID không trùng
    const isValid = await this.validateDiagnoseId(
      createDiagnoseDto.diagnose_id,
    );
    if (!isValid) {
      throw new Error(
        `Diagnose ID ${createDiagnoseDto.diagnose_id} already exists`,
      );
    }

    const created = new this.diagnoseModel({
      ...createDiagnoseDto,
      createdAt: new Date(),
      deleted: false,
    });
    return created.save();
  }
  /**
   * Lấy tất cả diagnoses (bao gồm cả đã xóa)
   * @returns Danh sách diagnoses
   */
  async findAll() {
    return this.diagnoseModel.find({});
  }

  /**
   * Tìm một diagnose theo ID
   * @param diagnose_id ID của diagnose cần tìm
   * @returns Diagnose nếu tìm thấy, null nếu không tìm thấy
   */
  async findOne(diagnose_id: string) {
    return this.diagnoseModel.findOne({ diagnose_id, deleted: false });
  }

  /**
   * Cập nhật một diagnose theo ID
   * @param diagnose_id ID của diagnose cần cập nhật
   * @param updateDiagnoseDto Dữ liệu cập nhật
   * @returns Diagnose đã được cập nhật
   */
  async update(diagnose_id: string, updateDiagnoseDto: UpdateDiagnoseDto) {
    return this.diagnoseModel.findOneAndUpdate(
      { diagnose_id, deleted: false },
      updateDiagnoseDto,
      { new: true },
    );
  }
  /**
   * Xóa một diagnose theo ID (soft delete)
   * @param diagnose_id ID của diagnose cần xóa
   * @returns Diagnose đã được xóa
   */
  async remove(diagnose_id: string) {
    const diagnose = await this.diagnoseModel.findOne({ diagnose_id });
    if (!diagnose) {
      throw new Error(`Diagnose with ID ${diagnose_id} not found`);
    }

    // Soft delete 
    return this.diagnoseModel.findOneAndUpdate(
      { diagnose_id },
      { 
        deleted: true,
      },
      { new: true },
    );
  }

  /**
   * Xóa một diagnose theo ID (hard delete)
   * @param diagnose_id ID của diagnose cần xóa
   * @returns Kết quả của thao tác xóa
   */
  //hard delete
  async hardDelete(diagnose_id: string) {
    return this.diagnoseModel.deleteOne({ diagnose_id }).exec();
  }
  /**
   * Khôi phục một diagnose đã bị xóa mềm (restore)
   * @param diagnose_id ID của diagnose cần khôi phục
   * @returns Diagnose đã được khôi phục
   */
  async restore(diagnose_id: string) {
    const diagnose = await this.diagnoseModel.findOne({ diagnose_id });
    if (!diagnose) {
      throw new Error(`Diagnose with ID ${diagnose_id} not found`);
    }

    return this.diagnoseModel.findOneAndUpdate(
      { diagnose_id },
      { 
        deleted: false,
      },
      { new: true },
    );
  }

  /**
   * Lấy tất cả diagnose_id đã sử dụng (bao gồm cả deleted)
   * @returns Danh sách diagnose_id đã sử dụng
   */
  async getAllUsedIds(): Promise<string[]> {
    const allDiagnoses = await this.diagnoseModel
      .find({}, { diagnose_id: 1 }) // Chỉ lấy diagnose_id
      .exec();
    return allDiagnoses.map((d) => d.diagnose_id);
  }

  /**
   * Tạo ID mới cho diagnose theo định dạng DGN0001, DGN0002, ...
   * @returns ID mới
   */
  async getNextDiagnoseId(): Promise<string> {
    const prefix = 'DGN';

    // Lấy tất cả IDs đã sử dụng (bao gồm cả deleted)
    const allIds = await this.getAllUsedIds();

    // Filter chỉ những ID có format đúng
    const validIds = allIds.filter((id) => id && id.startsWith(prefix));

    if (validIds.length === 0) {
      return prefix + '0001';
    }

    // Extract numbers và sort
    const usedNumbers = validIds
      .map((id) => parseInt(id.replace(prefix, ''), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    const maxNum = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;
    const nextNum = maxNum + 1;

    // Format thành DGN0001, DGN0002, etc.
    return prefix + nextNum.toString().padStart(4, '0');
  }
}
