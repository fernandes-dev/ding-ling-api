import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User'

class AuthController {
  async authenticate(request: Request, response: Response) {
    const repository = getRepository(User)
    const { email, password } = request.body

    const user = await repository.findOne({ where: { email } })

    if (!user) response.status(401).json({ message: 'Usuário não encontrado' })

    const isValidPassword = await bcrypt.compare(password, user?.password || '')

    if (!isValidPassword) return response.status(401).json({ message: 'Senha incorreta' })

    const token = jwt.sign({ id: user?.id }, process.env.SECRET || '', { expiresIn: '1d' })

    return response.json({
      user: {
        id: user?.id,
        email: user?.email,
      },
      token
    })
  }
}

export default new AuthController()