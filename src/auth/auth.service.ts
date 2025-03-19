import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(data: RegisterDto) {
        const hashedPassword = await argon2.hash(data.password)
        const verificationToken = crypto.randomBytes(32).toString('hex')

        data.password = hashedPassword

        const user = await this.prisma.user.create({
            data: { ...data, verificationToken }
        })

        await this.sendVerificationTokenEmail(user.email, verificationToken)

        return {
            message: 'Registro exitoso. Revisa tu correo para activar tu cuenta'
        }
    }

    async login(data: LoginDto, req: Request) {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } })

        if ( !user || !(await argon2.verify(user.password, data.password)) ) {
            throw new UnauthorizedException('Credenciales incorrectas')
        }

        if( !user.isVerified ) {
            throw new ForbiddenException('El usuario no esta activo')
        }

        const ip = (req.ip || req.headers['x-forwared-for'] || 'Desconocida').toString()

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                lastLoginIp: ip
            }
        })

        return this.generateToken(user.id, user.email)
    }

    async verifyEmail(token: string) {
        const user = await this.prisma.user.findUnique({ where: { verificationToken: token } })

        if ( !user ) {
            throw new BadRequestException('Token invalido')
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null
            }
        })

        return {
            message: 'Cuenta verificada correctamente'
        }
    }

    async sendVerificationTokenEmail(email: string, token: string) {
        const verificationLink = `http://localhost:3000/auth/verify?token=${token}`
        console.log(`Enviando email a ${email}: ${verificationLink}`)
    }

    private async generateToken(userId: string, email: string) {
        const payload = { sub: userId, email }

        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
