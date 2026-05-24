import { CourseCommentService } from "@modules/course/service/course-comment.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class SiteService {
    constructor(
        private readonly courseCommentService : CourseCommentService
    ){

    }


    async getHomePageIndex(){
        return {
            
        }
    }
}