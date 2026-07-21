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

    // Rate Limiting (100 requests per 15 minutes by default)
    ThrottlerModule.forRoot([{
      ttl: 60000 * 15,
      limit: 100,
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
