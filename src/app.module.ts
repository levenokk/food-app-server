import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExtraAddressModule } from './extra-address/extra-address.module';
import { AuthModule } from './auth/auth.module';
import { DishesModule } from './dishes/dishes.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { TagsModule } from './tags/tags.module';
import { FillingsModule } from './fillings/fillings.module';
import { OrdersModule } from './orders/orders.module';
import { MessagesModule } from './messages/messages.module';
import { decodeToken } from './services';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '/client',
      renderPath: '/client',
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.development.env' : '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadModels: true,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            const context: any = {};

            if (connectionParams?.Authorization) {
              const payload = decodeToken(
                connectionParams.Authorization.split(' ')[1],
              );

              if (payload) {
                context.user_id = (payload as { id: number })?.id;
              }
            }

            return context;
          },
        },
      },
      playground: true,
      debug: true,
      autoSchemaFile: true,
    }),
    UsersModule,
    ExtraAddressModule,
    AuthModule,
    DishesModule,
    InstitutionsModule,
    TagsModule,
    FillingsModule,
    OrdersModule,
    MessagesModule,
    UploadModule,
  ],
})
export class AppModule {}
