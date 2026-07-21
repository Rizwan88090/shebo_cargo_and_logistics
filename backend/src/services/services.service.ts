import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/services.dto';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    const existingTitle = await this.prisma.service.findUnique({
      where: { title: dto.title },
    });
    if (existingTitle) {
      throw new BadRequestException('Service title already exists');
    }

    const existingSlug = await this.prisma.service.findUnique({
      where: { slug: dto.slug.toLowerCase() },
    });
    if (existingSlug) {
      throw new BadRequestException('Service slug already exists');
    }

    return this.prisma.service.create({
      data: {
        ...dto,
        slug: dto.slug.toLowerCase(),
      },
    });
  }

  async findAll(activeOnly = false) {
    return this.prisma.service.findMany({
      where: activeOnly ? { status: ServiceStatus.ACTIVE } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug: slug.toLowerCase() },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (dto.title) {
      const existing = await this.prisma.service.findFirst({
        where: { title: dto.title, id: { not: id } },
      });
      if (existing) {
        throw new BadRequestException('Service title already in use');
      }
    }

    if (dto.slug) {
      const existing = await this.prisma.service.findFirst({
        where: { slug: dto.slug.toLowerCase(), id: { not: id } },
      });
      if (existing) {
        throw new BadRequestException('Service slug already in use');
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.slug ? dto.slug.toLowerCase() : undefined,
      },
    });
  }

  async remove(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return { message: 'Service deleted successfully' };
  }
}
