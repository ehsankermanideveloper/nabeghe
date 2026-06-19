import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AdminGuard } from '@modules/admin/guard/admin.guard';
import { AdminService } from '@modules/admin/service/admin.service';

@UseGuards(AdminGuard)
@Controller('admin/api')
export class AdminApiController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Users ───────────────────────────────────────────────────────────────────

  @Post('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateUserRole(parseInt(id, 10), body.role);
    res.json({ ok: true });
  }

  // ─── Courses ─────────────────────────────────────────────────────────────────

  @Post('courses')
  async createCourse(
    @Body() body: Record<string, any>,
    @Req() _req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.createCourse(body);
    res.redirect('/admin/courses');
  }

  @Post('courses/:id')
  async updateCourse(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateCourse(parseInt(id, 10), body);
    res.redirect(`/admin/courses/${id}/edit`);
  }

  @Patch('courses/:id/status')
  async updateCourseStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateCourseStatus(parseInt(id, 10), body.status);
    res.json({ ok: true });
  }

  @Delete('courses/:id')
  async deleteCourse(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.deleteCourse(parseInt(id, 10));
    res.json({ ok: true });
  }

  // ─── Articles ────────────────────────────────────────────────────────────────

  @Post('articles')
  async createArticle(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.createArticle(body);
    res.redirect('/admin/articles');
  }

  @Post('articles/:id')
  async updateArticle(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateArticle(parseInt(id, 10), body);
    res.redirect(`/admin/articles/${id}/edit`);
  }

  @Patch('articles/:id/status')
  async updateArticleStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateArticleStatus(parseInt(id, 10), body.status);
    res.json({ ok: true });
  }

  @Delete('articles/:id')
  async deleteArticle(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.deleteArticle(parseInt(id, 10));
    res.json({ ok: true });
  }

  // ─── Categories ──────────────────────────────────────────────────────────────

  @Post('categories')
  async createCategory(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.createCategory(body);
    res.redirect('/admin/categories');
  }

  @Post('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateCategory(parseInt(id, 10), body);
    res.redirect('/admin/categories');
  }

  @Patch('categories/:id/toggle')
  async toggleCategory(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.adminService.toggleCategoryActive(parseInt(id, 10));
    res.json({ ok: true, isActive: result.isActive });
  }

  @Delete('categories/:id')
  async deleteCategory(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.deleteCategory(parseInt(id, 10));
    res.json({ ok: true });
  }

  // ─── Comments ────────────────────────────────────────────────────────────────

  @Patch('comments/course/:id')
  async updateCourseComment(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateCourseCommentStatus(parseInt(id, 10), body.status);
    res.json({ ok: true });
  }

  @Patch('comments/article/:id')
  async updateArticleComment(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.updateArticleCommentStatus(parseInt(id, 10), body.status);
    res.json({ ok: true });
  }

  // ─── Enrollments ─────────────────────────────────────────────────────────────

  @Post('enrollments')
  async addEnrollment(
    @Body() body: { courseId: number; userId: number },
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.addEnrollment(
      Number(body.courseId),
      Number(body.userId),
    );
    res.json({ ok: true });
  }

  @Delete('enrollments/:id')
  async removeEnrollment(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.removeEnrollment(parseInt(id, 10));
    res.json({ ok: true });
  }

  // ─── Chapters ────────────────────────────────────────────────────────────────

  @Get('courses/:id/chapters')
  async getChapters(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.adminService.getChaptersByCourse(parseInt(id, 10));
    res.json(data);
  }

  @Post('courses/:id/chapters')
  async createChapter(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    const chapter = await this.adminService.createChapter(parseInt(id, 10), body);
    res.json({ ok: true, chapter });
  }

  @Post('chapters/:id')
  async updateChapter(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    const chapter = await this.adminService.updateChapter(parseInt(id, 10), body);
    res.json({ ok: true, chapter });
  }

  @Delete('chapters/:id')
  async deleteChapter(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.deleteChapter(parseInt(id, 10));
    res.json({ ok: true });
  }

  // ─── Episodes ─────────────────────────────────────────────────────────────────

  @Post('courses/:id/episodes')
  async createEpisode(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    const episode = await this.adminService.createEpisode(parseInt(id, 10), body);
    res.json({ ok: true, episode });
  }

  @Post('episodes/:id')
  async updateEpisode(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    const episode = await this.adminService.updateEpisode(parseInt(id, 10), body);
    res.json({ ok: true, episode });
  }

  @Delete('episodes/:id')
  async deleteEpisode(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.adminService.deleteEpisode(parseInt(id, 10));
    res.json({ ok: true });
  }
}
