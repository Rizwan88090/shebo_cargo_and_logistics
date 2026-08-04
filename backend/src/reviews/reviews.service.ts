import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    return this.prisma.review.create({ data: dto });
  }

  /** Public: only approved reviews, newest first. */
  async findApproved() {
    return this.prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Admin: every review, newest first. */
  async findAll() {
    return this.prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.findOne(id);
    return this.prisma.review.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted successfully' };
  }

  private async findOne(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }
}
