import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate Limiting. The admin/tracking/order pages poll every few seconds for
    // near-real-time updates, so the ceiling needs real headroom above that
    // baseline traffic — a 100-per-15-minutes cap throttles normal usage almost
    // immediately once more than one tab is open.
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 120,
    }]),

    // Core Database Module
    PrismaModule,

    // App Modules
    AuthModule,
    UsersModule,
    CountriesModule,
    CitiesModule,
    ServicesModule,
    OrdersModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
