import { User } from 'src/auth/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotFoundException } from '@nestjs/common';
import { Booking } from './booking.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BookingStatus } from './booking-status.enum';
import { v4 as uuid } from 'uuid';

@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {
  async createBooking(
    createBookingDto: CreateBookingDto,
    user: User,
  ): Promise<Booking> {
    const { picklocation, droplocation, customer } = createBookingDto;

    const booking = new Booking();
    booking.id = uuid();
    booking.picklocation = picklocation;
    booking.droplocation = droplocation;
    booking.status = BookingStatus.OPEN;
    booking.distributorid = user.id;
    booking.customerid = customer.id;

    // const cust = new Customer();
    // cust.id = customer.id;
    // cust.fullname = customer.fullname;
    // cust.homeaddress = customer.homeaddress;
    // cust.emailaddress = customer.emailaddress;
    // cust.dateofbirth = customer.dateofbirth;
    // cust.telephonenumber = customer.telephonenumber;
    // booking.customer = cust;

    await booking.save();
    //delete booking.user;
    return booking;
  }

  async getAllBookings(user: User): Promise<Booking[]> {
    return await this.find({ distributorid: user.id });
  }

  async getBookingById(id: string, user: User): Promise<Booking> {
    const found = await this.findOne({ id, distributorid: user.id });
    if (!found)
      throw new NotFoundException(`Booking with Id "${id}" not found`);

    return found;
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    user: User,
  ): Promise<Booking> {
    await this.getBookingById(id, user);
    await this.update({ id, distributorid: user.id }, { status });
    return await this.getBookingById(id, user);
  }

  async deleteBooking(id: string, user: User): Promise<void> {
    await this.getBookingById(id, user);
    await this.delete({ id, distributorid: user.id });
  }
}
