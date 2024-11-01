import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from '../auth/user-details.decorator';
import { CreateOrUpdateNotepadRequestDTO } from './dtos/request/create-or-update-notepad-request.dto';
import { NotepadResponseDTO } from './dtos/response/notepad-response.dto';
import NotepadService from './notepad.service';
import FirebaseAuthGuard from '../auth/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'notes', version: '1' })
export class NotepadController {

    constructor(
        private _service: NotepadService
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() record: CreateOrUpdateNotepadRequestDTO, @CurrentUser('uid') ownerId: string) {
        const result = await this._service.create(record, ownerId);
        return new NotepadResponseDTO(result);
    }

    @Get(":id")
    async findByOwnerId(@Param('id') id: string, @CurrentUser('uid') ownerId: string) {
        const result = await this._service.findByOwnerId(id, ownerId);
        return new NotepadResponseDTO(result);
    }

    @Get()
    async listByOwnerId(@CurrentUser('uid') ownerId: string) {
        const result = await this._service.listByOwnerId(ownerId);
        return result.map(obj => new NotepadResponseDTO(obj));
    }

    @Delete(":id")
    async deleteById(@Param('id') id: string, @CurrentUser('uid') ownerId: string) {
        return this._service.deleteByIdAndOwnerId(id, ownerId);
    }

    @Put(":id")
    async update(@Param('id') id: string, @Body() record: CreateOrUpdateNotepadRequestDTO, @CurrentUser('uid') ownerId: string) {
        return this._service.update(id, ownerId, record);
    }
}
