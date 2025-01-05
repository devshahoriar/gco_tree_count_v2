export const APP_URL = process.env.NODE_ENV! === 'production' ? process.env.NEXT_PUBLIC_URL! : "http://localhost:3000"

export const USERROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
}

export const PERMISSIONS = {
  OT4OC: 'OT4OC',
  USER: 'USER',
  DATA: 'DATA',
  REPORT: 'REPORT',
}
// OT4OC,USER,DATA,REPORT

export enum FILETYPE {
  TREEPHOTOINITIAL = 'tfi',
  TREEPHOTOODIT = 'tfo',
  USERPROFILEPHOTO = 'upp',
}
