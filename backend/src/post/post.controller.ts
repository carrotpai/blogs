import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { CreatePostDTO } from './dtos/createPostDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  getPost(@Param('id') postId) {
    return this.postService.getPost(+postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upvote/:id')
  upvotePost(
    @Request() { user }: RequestWithUser,
    @Param('id') postId: number,
  ) {
    return this.postService.upvote(user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('downvote/:id')
  downvotePost(
    @Request() { user }: RequestWithUser,
    @Param('id') postId: number,
  ) {
    return this.postService.downvote(user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  createPost(
    @Request() { user }: RequestWithUser,
    @Body() createPostDto: CreatePostDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    cover?: Express.Multer.File,
  ) {
    this.postService.createPost(createPostDto, user.id, cover);
    return 'created';
  }
}
