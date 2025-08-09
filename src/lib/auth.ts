import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export function createJWTToken(payload: { userId: string, email: string }) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJWTToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  return jwt.verify(token, process.env.JWT_SECRET) as { userId: string, email: string }
}

// User utilities
export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      image: true,
      emailVerified: true,
      createdAt: true
    }
  })
}

export async function createUser(data: {
  email: string
  password?: string
  name?: string
  image?: string
}) {
  return db.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      emailVerified: true,
      createdAt: true
    }
  })
}