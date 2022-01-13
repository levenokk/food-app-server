import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { SendMessageInput } from './dto/inputs';

// todo добавить лимиты

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    private ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  public async getOrderChat(id: number, user_id: number) {
    const order = await this.ordersService.getOrderById(id);
    const user = await this.usersService.finUserById(user_id);

    if (!order) {
      throw new NotFoundException();
    }

    if (
      order.user_id !== user_id &&
      order.institution_id !== user.institution.id
    ) {
      throw new BadGatewayException('You can not get stranger chat');
    }

    return order.messages;
  }

  public async sendMessage({
    order_id,
    user_id,
    ...data
  }: SendMessageInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);
    const order = await this.ordersService.getOrderById(order_id);

    if (!order) {
      throw new NotFoundException();
    }

    if (
      order.user_id !== user_id &&
      order.institution_id !== user.institution.id
    ) {
      throw new BadGatewayException(
        'You can not send message to stranger chat',
      );
    }

    return this.messageModel.create({
      ...data,
      user_id,
      institution_order_id: order_id,
    });
  }
}
