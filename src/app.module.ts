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

@Module({
  imports: [
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
        'graphql-ws': {
          onConnect: (context: any) => {
            const { connectionParams, extra } = context;
            console.log('here');
            extra.user = { user: {} };
          },
        },
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            const authToken = connectionParams;

            console.log(connectionParams);

            return {};
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
  ],
})
export class AppModule {}
