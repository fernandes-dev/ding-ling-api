import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: string
  iat: number
  exp: number
}

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const { authorization } = request.headers

  if (!authorization) return response.status(401).json({ message: 'Token não encontrado' })

  const token = String(authorization?.replace('Bearer', '').trim())

  try {
    const data = jwt.verify(token, String(process.env.SECRET))

    const { id } = data as TokenPayload

    request.userId = id;

    return next()
  } catch {
    response.status(401).json({ message: 'Token inválido' })
  }
}