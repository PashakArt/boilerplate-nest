import {Controller, Put, Query, UploadedFile} from '@nestjs/common';
import {ApiOkResponse, ApiQuery} from '@nestjs/swagger';
import {DataMapper} from '@steroidsjs/nest/src/usecases/helpers/DataMapper';
import {FileUpload} from '../decorators/FileUpload';
import {IExpressSource} from '../../domain/interfaces/IExpressSource';
import {FileService} from '../../domain/services/FileService';
import {FileUploadOptions} from '../../domain/dtos/FileUploadOptions';
import {FileExpressSourceDto} from '../../domain/dtos/sources/FileExpressSourceDto';
import {FileUploadDto} from '../../domain/dtos/FileUploadDto';
import {FileImageSchema} from '../schemas/FileImageSchema';
import {AuthPermissions} from '../../../auth/infrastructure/decorators/AuthPermissions';
import {PERMISSION_AUTH_AUTHORIZED} from '../../../auth/infrastructure/permissions';
import {FileSchema} from '../schemas/FileSchema';

@Controller('/file')
export default class FileController {
    constructor(
        private readonly fileService: FileService,
    ) {
    }

    @Put('/upload-photo')
    @AuthPermissions(PERMISSION_AUTH_AUTHORIZED)
    @ApiQuery({type: FileUploadDto})
    @ApiOkResponse({type: FileImageSchema})
    @FileUpload()
    async photos(
        @Query() dto: FileUploadDto,
        @UploadedFile() file: IExpressSource,
    ) {
        return this.fileService.upload(
            DataMapper.create<FileUploadOptions>(FileUploadOptions, {
                ...dto,
                source: DataMapper.create(FileExpressSourceDto, file),
            }),
            FileImageSchema,
        );
    }

    @Put('/upload-file')
    @AuthPermissions(PERMISSION_AUTH_AUTHORIZED)
    @ApiQuery({type: FileUploadDto})
    @ApiOkResponse({type: FileSchema})
    @FileUpload()
    async files(
        @UploadedFile() file: IExpressSource,
        @Query()dto: FileUploadDto,
    ) {
        return this.fileService.upload(
            DataMapper.create<FileUploadOptions>(FileUploadOptions, {
                ...dto,
                source: DataMapper.create(FileExpressSourceDto, file),
            }),
            FileSchema,
        );
    }
}
