import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BoardState } from '@prisma/client';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
    
    @IsOptional()
    @IsEnum(BoardState)
    state?: string
}
