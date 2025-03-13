import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, RequestMethod, ValidationPipe } from "@nestjs/common";
import { envs } from "./config/envs";
import { RpcCustomExceptionFilter } from "./common/exceptions/rpc-custom-exception.filter";

async function bootstrap(){
    const logger = new Logger('Main-gateway')
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api', {
        exclude: [{
            path: '',
            method: RequestMethod.GET,
        }],
    })
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );
    app.useGlobalFilters(new RpcCustomExceptionFilter())

    console.log('Health Check Configured');

    await app.listen(envs.port);
    logger.log(`Gateway running on port ${envs.port}`)
}

bootstrap();