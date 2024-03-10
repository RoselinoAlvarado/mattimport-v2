export interface User {
  uid: string,
  email: string,
  password: string,
  name: string
}

export interface Users {
  id: number,
  name: string,
  phoneNumber: string,
  email: string
}

export interface Sale {
  user_id: number,
  product_name: string,
  payment_date: string,
  value: number,
  paid: number,
  parcel: number,
  product_img: string
}
