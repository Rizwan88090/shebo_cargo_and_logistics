import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalCountries,
      totalCities,
      totalServices,
      activeUsers,
      inactiveUsers,
      activeServices,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.country.count(),
      this.prisma.city.count(),
      this.prisma.service.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
      this.prisma.service.count({ where: { status: 'ACTIVE' } }),
    ]);

    // Role distribution counts
    const roleStats = await this.prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    const roleDistribution = roleStats.reduce(
      (acc, curr) => {
        acc[curr.role] = curr._count.role;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      summary: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          distribution: {
            user: roleDistribution['USER'] || 0,
            admin: roleDistribution['ADMIN'] || 0,
            superAdmin: roleDistribution['SUPER_ADMIN'] || 0,
          },
        },
        destinations: {
          countries: totalCountries,
          cities: totalCities,
        },
        services: {
          total: totalServices,
          active: activeServices,
          inactive: totalServices - activeServices,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
