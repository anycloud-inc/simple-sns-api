import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Get, Post } from 'src/lib/controller'
import { postSerializer } from './post.serializer'
import { postService } from './post.service'
import { Post as PostEntity } from './post.entity'
import { getRepository } from 'typeorm'
import { postPolicy } from './post.policy'
import {
  checkParameterOrFail,
  getPaginationParams,
} from 'src/lib/request-utils'

@Controller('/posts')
export class PostController {
  @Get()
  @Auth
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await postService.find({
        filter: req.query.filter as any,
        pagination: getPaginationParams(req.query),
      })
      res.json({
        posts: posts.map(post => postSerializer.build(post)),
      })
    } catch (e) {
      next(e)
    }
  }

  @Get('/:id(\\d+)')
  @Auth
  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.findOneOrFail(parseInt(req.params.id))
      await postPolicy.showableOrFail(post, req.currentUser.id!)
      res.json({ post: postSerializer.build(post) })
    } catch (e) {
      next(e)
    }
  }

  @Post()
  @Auth
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      checkParameterOrFail(req.body, 'post')
      const post = await postService.createPost(
        req.currentUser.id!,
        req.body.post
      )

      res.json({ post: postSerializer.build(post) })
    } catch (e) {
      next(e)
    }
  }

  @Auth
  @Delete('/:id')
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = getRepository(PostEntity)
      await postPolicy.deletableOrFail(
        parseInt(req.params.id),
        req.currentUser.id!
      )
      await repo.delete(req.params.id)
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}
