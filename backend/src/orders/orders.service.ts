import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${year}-${rand}`;
  }

  private generateTrackingNumber(): string {
    const rand = Math.floor(10_000_000 + Math.random() * 89_999_999);
    return `MRD-AE-${rand}`;
  }

  async create(dto: CreateOrderDto, userId?: string) {
    return this.prisma.order.create({
      data: {
        ...dto,
        orderNumber: this.generateOrderNumber(),
        trackingNumber: this.generateTrackingNumber(),
        userId: userId ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByIds(ids: string[]) {
    if (!ids.length) return [];
    return this.prisma.order.findMany({
      where: { id: { in: ids } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByTrackingNumber(trackingNumber: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { trackingNumber: { equals: trackingNumber, mode: 'insensitive' } },
          { orderNumber: { equals: trackingNumber, mode: 'insensitive' } },
        ],
      },
    });
    if (!order) {
      throw new NotFoundException('No order found for that tracking number.');
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findOne(id);
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.order.delete({ where: { id } });
    return { message: 'Order deleted successfully' };
  }
}
