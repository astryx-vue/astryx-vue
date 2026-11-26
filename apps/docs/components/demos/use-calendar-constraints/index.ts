import { defineDemo } from '../../demo-infra/defineDemo'
import hotelBookingDemo from './hotel-booking.vue'
import hotelBookingSource from './hotel-booking.vue?raw&highlighted'

export const useCalendarConstraintsHotelBooking = defineDemo(hotelBookingDemo, hotelBookingSource)
