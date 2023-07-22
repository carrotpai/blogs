import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDTO } from './dtos/createPostDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  getPost(@Param('id') postId) {
    return this.postService.getPost(+postId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  createPost(
    @Body(new ValidationPipe({ transform: true })) createPostDto: CreatePostDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    cover?: Express.Multer.File,
  ) {
    this.postService.createPost(createPostDto, cover);
    return 'created';
  }
}
