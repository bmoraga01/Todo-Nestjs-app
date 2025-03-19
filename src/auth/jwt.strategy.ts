import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(

        private config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_SECRET') || 'defaul-secret-key'
        })
    }

    async validate(payload: { sub: string, email: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            omit: { password: true }
        })

        if ( !user ) {
            throw new UnauthorizedException('El token expiro o el usuario no existe')
        }

        return user
    }
}