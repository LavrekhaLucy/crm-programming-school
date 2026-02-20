import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderEntity } from '../../../database/entities/order.entity';
import { CreateOrderDto } from '../models/dto/req/create-order.dto';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { OrdersStatsDto } from '../models/dto/req/order-stats.dto';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { ResponseOrderDto } from '../models/dto/res/response-order.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { PaginatedResponse } from '../../../common/types/pagination.type';
import { OrdersQueryDto } from '../models/dto/req/orders-query.dto';
import { parseOrder } from '../utils/order-query.util';
import { OrdersMapper } from '../orders.mapper';
import { GroupEntity } from '../../../database/entities/group.entity';
import * as ExcelJS from 'exceljs';
import { IOrderRawStats } from '../interfaces/order-raw-stats.interface';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private getFilteredOrdersQB(query: OrdersQueryDto, userId: number) {
    const {
      name,
      surname,
      email,
      phone,
      age,
      startDate,
      endDate,
      course,
      course_format,
      course_type,
      status,
      group,
      onlyMine,
    } = query;

    const qb = this.orderRepository.createQueryBuilder('order');

    qb.leftJoinAndSelect('order.group', 'group');
    qb.leftJoinAndSelect('order.manager', 'manager');

    if (name)
      qb.andWhere('LOWER(order.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    if (surname)
      qb.andWhere('LOWER(order.surname) LIKE :surname', {
        surname: `%${surname.toLowerCase()}%`,
      });
    if (email)
      qb.andWhere('LOWER(order.email) LIKE :email', {
        email: `%${email.toLowerCase()}%`,
      });
    if (phone)
      qb.andWhere('LOWER(order.phone) LIKE :phone', {
        phone: `%${phone.toLowerCase()}%`,
      });

    if (age) qb.andWhere('order.age = :age', { age: Number(age) });
    if (startDate) qb.andWhere('order.created_at >= :startDate', { startDate });
    if (endDate) qb.andWhere('order.created_at <= :endDate', { endDate });

    if (course) qb.andWhere('order.course = :course', { course });
    if (course_format)
      qb.andWhere('order.course_format = :course_format', { course_format });
    if (course_type)
      qb.andWhere('order.course_type = :course_type', { course_type });
    if (status) qb.andWhere('order.status = :status', { status });
    if (group) qb.andWhere('order.group = :group', { group });

    if (onlyMine === 'true') {
      qb.andWhere('order.managerId = :userId', { userId });
    }

    return qb;
  }

  async create(dto: CreateOrderDto): Promise<ResponseOrderDto> {
    const newOrder = this.orderRepository.create({
      ...dto,
      status: StatusesEnum.NEW,
    });
    return this.orderRepository.save(newOrder);
  }

  async findAll(
    query: OrdersQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<OrderEntity>> {
    const { page = '1', limit = '25', order } = query;
    const qb = this.getFilteredOrdersQB(query, userId);

    const { sortBy, sortOrder } = parseOrder(order);
    qb.orderBy(`order.${sortBy}`, sortOrder);

    qb.skip((+page - 1) * +limit);
    qb.take(+limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: +page, limit: +limit };
  }

  async exportToExcel(query: OrdersQueryDto, userId: number) {
    const qb = this.getFilteredOrdersQB(query, userId);

    const orders = await qb.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 15 },
      { header: 'Surname', key: 'surname', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Course', key: 'course', width: 15 },
      { header: 'Course format', key: 'course_format', width: 15 },
      { header: 'Course type', key: 'course_type', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Group', key: 'group', width: 20 },
      { header: 'Created_at', key: 'createdAt', width: 20 },
      { header: 'Manager', key: 'manager', width: 20 },
    ];

    for (const order of orders) {
      worksheet.addRow({
        id: order.id,
        name: order.name,
        surname: order.surname,
        email: order.email,
        phone: order.phone,
        age: order.age,
        course: order.course,
        course_format: order.course_format,
        course_type: order.course_type,
        status: order.status,
        group: order.group?.name || 'No group',
        createdAt: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : '',
        manager: order.manager?.surname || 'Not assigned',
      });
    }

    worksheet.getRow(1).font = { bold: true };

    return await workbook.xlsx.writeBuffer();
  }

  async findOne(id: string): Promise<ResponseOrderDto> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async assignManager(orderId: string, managerId: number) {
    return this.entityManager.transaction(async (em) => {
      const orderRepository = em.getRepository(OrderEntity);

      const order = await orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      const userRepository = em.getRepository(UserEntity);
      const manager = await userRepository.findOneBy({ id: managerId });

      if (!manager) {
        throw new NotFoundException('Manager not found');
      }

      order.manager = manager;
      return orderRepository.save(order);
    });
  }

  async takeOrder(orderId: string, managerId: number) {
    return this.entityManager.transaction(async (em) => {
      const orderRepository = em.getRepository(OrderEntity);
      const order = await orderRepository.findOne({
        where: { id: orderId },
        relations: ['manager'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (order.manager) {
        throw new BadRequestException('This order already has a manager.');
      }

      return await orderRepository.update(orderId, {
        manager: { id: managerId },
        status: StatusesEnum.INWORK,
      });
    });
  }

  async getStatsByStatus(): Promise<OrdersStatsDto> {
    const rows: IOrderRawStats[] = await this.orderRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(o.id)', 'count')
      .groupBy('o.status')
      .getRawMany();

    const total = await this.orderRepository.count();

    const statsResult: OrdersStatsDto = {
      total,
      agree: 0,
      in_work: 0,
      disagree: 0,
      dubbing: 0,
      new: 0,
    };

    for (const row of rows) {
      const statusKey = row.status as keyof OrdersStatsDto;
      if (statusKey in statsResult) {
        statsResult[statusKey] = Number(row.count) || 0;
      }
    }
    return statsResult;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<ResponseOrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) throw new NotFoundException(`Order #${id} not found`);

    if (dto.group) order.group = { id: dto.group } as GroupEntity;
    if (dto.manager) order.manager = { id: dto.manager } as UserEntity;

    const { group: _group, manager: _manager, ...rest } = dto;
    Object.assign(order, rest);

    await this.orderRepository.save(order);

    const updatedOrder = await this.orderRepository.findOne({
      where: { id },
      relations: ['group', 'manager'],
    });

    return OrdersMapper.toResDto(updatedOrder);
  }

  async delete(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Order #${id} not found`);
    }
  }
}
