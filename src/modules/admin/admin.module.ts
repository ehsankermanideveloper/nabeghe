import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '@modules/admin/guard/admin.guard';
import { AdminService } from '@modules/admin/service/admin.service';
import { AdminViewController } from '@modules/admin/controller/admin-view.controller';
import { AdminApiController } from '@modules/admin/controller/admin-api.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AdminViewController, AdminApiController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
