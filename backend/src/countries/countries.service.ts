import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto, UpdateCountryDto } from './dto/countries.dto';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCountryDto) {
    const existingName = await this.prisma.country.findUnique({
      where: { name: dto.name },
    });
    if (existingName) {
      throw new BadRequestException('Country name already exists');
    }

    const existingCode = await this.prisma.country.findUnique({
      where: { code: dto.code.toUpperCase() },
    });
    if (existingCode) {
      throw new BadRequestException('Country code already exists');
    }

    return this.prisma.country.create({
      data: {
        ...dto,
        code: dto.code.toUpperCase(),
      },
    });
  }

  async findAll(activeOnly = false) {
    return this.prisma.country.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: { cities: true },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }

  async update(id: string, dto: UpdateCountryDto) {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    if (dto.name) {
      const existing = await this.prisma.country.findFirst({
        where: { name: dto.name, id: { not: id } },
      });
      if (existing) {
        throw new BadRequestException('Country name already in use');
      }
    }

    if (dto.code) {
      const existing = await this.prisma.country.findFirst({
        where: { code: dto.code.toUpperCase(), id: { not: id } },
      });
      if (existing) {
        throw new BadRequestException('Country code already in use');
      }
    }

    return this.prisma.country.update({
      where: { id },
      data: {
        ...dto,
        code: dto.code ? dto.code.toUpperCase() : undefined,
      },
    });
  }

  async remove(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    await this.prisma.country.delete({
      where: { id },
    });

    return { message: 'Country deleted successfully' };
  }
}
