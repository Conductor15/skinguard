import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { OrderDetail, OrderDetailDocument } from '../order_detail/entities/order_detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderDetail.name) private orderDetailModel: Model<OrderDetailDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }  // Lấy order với details và products
  async findAllWithDetails(): Promise<any[]> {
    const orders = await this.orderModel.find().lean().exec();
    
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const orderDetails = await this.orderDetailModel
            .find({ orderID: order._id })
            .populate('productID')
            .lean()
            .exec();
          
          return {
            ...order,
            orderDetails: orderDetails,
          };
        } catch (error) {
          console.error(`Error fetching details for order ${order._id}:`, error);
          return {
            ...order,
            orderDetails: [],
          };
        }
      })
    );
    
    return ordersWithDetails;
  }async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  // Lấy 1 order với details
  async findOneWithDetails(id: string): Promise<any> {
    const order = await this.orderModel.findById(id).lean().exec();
    
    if (!order) return null;
    
    const orderDetails = await this.orderDetailModel
      .find({ orderID: order._id })
      .populate('productID')
      .lean()
      .exec();
    
    return {
      ...order,
      orderDetails: orderDetails
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
