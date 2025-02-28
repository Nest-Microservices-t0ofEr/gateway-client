import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config/services';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy
) {}
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create' }, createProductDto)
      .pipe(
        catchError( err => {throw new RpcException(err)})
      );
  }
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.client.send({ cmd: 'findAll' }, paginationDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string){
    return this.client.send({ cmd: 'findOne' }, {id})
      .pipe(
        catchError( err => {throw new RpcException(err)})
      );
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'findOne' }, {id}),
    //   ) 
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete' }, {id})
      .pipe(
        catchError( err => {throw new RpcException(err)})
    );
  }
  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.client.send({ cmd: 'update' }, {id, ...updateProductDto})
      .pipe(
        catchError( err => {throw new RpcException(err)})
    );
  }
}
