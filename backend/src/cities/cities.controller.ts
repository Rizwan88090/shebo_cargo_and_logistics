import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto, UpdateCityDto } from './dto/cities.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new city (Admins only)' })
  @ApiResponse({ status: 201, description: 'City successfully created' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all cities list' })
  @ApiQuery({ name: 'countryId', type: String, required: false, description: 'Filter by Country UUID' })
  @ApiQuery({ name: 'activeOnly', type: Boolean, required: false, description: 'Filter active only' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  async findAll(
    @Query('countryId') countryId?: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const filterActive = activeOnly === 'true';
    return this.citiesService.findAll(countryId, filterActive);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a city' })
  @ApiResponse({ status: 200, description: 'City details' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update city details (Admins only)' })
  @ApiResponse({ status: 200, description: 'City updated' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a city (Admins only)' })
  @ApiResponse({ status: 200, description: 'City deleted' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
