import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto, UpdateCountryDto } from './dto/countries.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new country (Admins only)' })
  @ApiResponse({ status: 201, description: 'Country successfully created' })
  async create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all countries list' })
  @ApiQuery({ name: 'activeOnly', type: Boolean, required: false, description: 'Filter active only' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  async findAll(@Query('activeOnly') activeOnly?: string) {
    const filterActive = activeOnly === 'true';
    return this.countriesService.findAll(filterActive);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a country' })
  @ApiResponse({ status: 200, description: 'Country details' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update country details (Admins only)' })
  @ApiResponse({ status: 200, description: 'Country updated' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a country (Admins only)' })
  @ApiResponse({ status: 200, description: 'Country deleted' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
