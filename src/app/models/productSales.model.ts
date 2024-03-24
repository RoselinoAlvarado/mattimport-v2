export interface Product {
  paid: number,
  value: number,
  product_id?: number,
  payment_date: string,
  product_name: string,
  product_img: string
}

export interface ProductSale {
  user_id: number,
  product_name: string,
  payment_date: string,
  value: number,
  paid: number,
  parcel: number,
  product_img: string
}

export interface ProductSalesByUser {
  id: number,
  name: string,
  notificate: number,
  products: Product[],
  total: number
}
