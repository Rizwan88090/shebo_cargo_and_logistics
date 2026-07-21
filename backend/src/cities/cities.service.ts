import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto, UpdateCityDto } from './dto/cities.dto';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCityDto) {
    // Check if country exists
    const country = await this.prisma.country.findUnique({
      where: { id: dto.countryId },
    });
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    // Check if city name is already registered for this country
    const existing = await this.prisma.city.findUnique({
      where: {
        name_countryId: {
          name: dto.name,
          countryId: dto.countryId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('City with this name already exists in the selected country');
    }

    return this.prisma.city.create({
      data: dto,
    });
  }

  async findAll(countryId?: string, activeOnly = false) {
    return this.prisma.city.findMany({
      where: {
        countryId: countryId || undefined,
        isActive: activeOnly ? true : undefined,
      },
      include: {
        country: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const city = await this.prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const countryId = dto.countryId || city.countryId;
    const cityName = dto.name || city.name;

    // Check country validity if updated
    if (dto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: { id: dto.countryId },
      });
      if (!country) {
        throw new NotFoundException('Country not found');
      }
    }

    // Check uniqueness constraint
    if (dto.name || dto.countryId) {
      const existing = await this.prisma.city.findFirst({
        where: {
          name: cityName,
          countryId: countryId,
          id: { not: id },
        },
      });
      if (existing) {
        throw new BadRequestException('City with this name already exists in the selected country');
      }
    }

    return this.prisma.city.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    await this.prisma.city.delete({
      where: { id },
    });

    return { message: 'City deleted successfully' };
  }
}
