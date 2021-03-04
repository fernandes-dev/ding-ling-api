import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../models/User'

class UserController {
  async index(request: Request, response: Response) {
    const repository = getRepository(User)

    const users = await repository.find()
    const userId = request.userId

    return response.json({ users, userId })
  }

  async store(request: Request, response: Response) {
    const repository = getRepository(User)
    const { email, password } = request.body

    const userExists = await repository.findOne({ where: { email } })

    if (userExists) return response.status(409).json({ message: 'Já existe' })

    const user = repository.create({ email, password })

    await repository.save(user)

    return response.json(user)
  }
}

export default new UserController()