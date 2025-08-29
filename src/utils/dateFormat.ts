import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

type TDate = Date | string | Dayjs
export const YYYYMMDD = (date: TDate, separator: string = '/') => {
  return dayjs(date).format(`YYYY${separator}MM${separator}DD`)
}

export const DDMMYYYY = (date: TDate, separator = '/') => {
  return dayjs(date).format(`DD${separator}MM${separator}YYYY`)
}

export const DDMMYYYY_HHmm = (date: TDate, separator = '/') => {
  return dayjs(date).format(`DD${separator}MM${separator}YYYY HH:mm`)
}

export const getRelativeTime = (date: TDate, locale: 'en' | 'vi' = 'vi') => {
  return dayjs().locale(locale).to(dayjs(date))
}

export const HHmm = (date: TDate) => {
  return dayjs(date).format('HH:mm')
}

export const HHmmss = (date: TDate) => {
  return dayjs(date).format('HH:mm:ss')
}

export const HHmmDDMMYYYY = (date: TDate) => {
  return dayjs(date).format('HH:mm DD/MM/YYYY')
}

export const DDMMYYYYHHmmss = (date: TDate, separator = '/') => {
  const response = dayjs(date).format('DD/MM/YYYY HH:mm:ss')

  return response
}

export const setStandardDate = (date: TDate, type: 'start' | 'end' = 'start') => {
  const dateYyyymmdd = dayjs(date).format('YYYY-MM-DD')
  const tzOffset = new Date().getTimezoneOffset() / -60
  const yyyymmddDash = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
  if (!yyyymmddDash.test(dateYyyymmdd)) return ''
  if (type === 'start') {
    return dayjs(dateYyyymmdd).add(tzOffset, 'hour').toISOString()
  } else if (type === 'end') {
    return dayjs(dateYyyymmdd).add(tzOffset, 'hour').add(23, 'hour').add(59, 'minute').add(59, 'second').toISOString()
  } else {
    return ''
  }
}
