import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { SendMessageInput } from './dto/inputs';
import { InstitutionsService } from '../institutions/institutions.service';

// todo добавить лимиты

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private institutionsService: InstitutionsService,
  ) {}

  public async getOrderChat(id: number, user_id: number) {
    const order = await this.ordersService.getOrderById(id);
    const institution = await this.institutionsService.getInstitutionByUserId(
      user_id,
    );

    if (!order) {
      throw new NotFoundException();
    }

    if (order.user_id !== user_id && order.institution_id !== institution?.id) {
      throw new ForbiddenException('You can not get stranger chat');
    }

    return order.messages;
  }

  public async sendMessage({
    order_id,
    user_id,
    ...data
  }: SendMessageInput & { user_id: number }) {
    const order = await this.ordersService.getOrderById(order_id);
    const institution = await this.institutionsService.getInstitutionByUserId(
      user_id,
    );

    if (!order) {
      throw new NotFoundException();
    }

    if (order.user_id !== user_id && order.institution_id !== institution?.id) {
      throw new ForbiddenException('You can not send message to stranger chat');
    }

    return this.messageModel.create({
      ...data,
      user_id,
      institution_order_id: order_id,
    });
  }
}
