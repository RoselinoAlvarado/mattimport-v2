export class Options {
  static readonly paidOptions = [
    { value: '1', label: 'Sim' },
    { value: '0', label: 'Não' }
  ];

  static readonly parcelOptions = [
    { value: '1', label: 'x1' },
    { value: '2', label: 'x2' },
    { value: '3', label: 'x3' },
    { value: '4', label: 'x4' },
    { value: '5', label: 'x5' },
    { value: '6', label: 'x6' },
    { value: '7', label: 'x7' },
    { value: '8', label: 'x8' },
    { value: '9', label: 'x9' },
    { value: '10', label: 'x10' },
    { value: '11', label: 'x11' },
    { value: '12', label: 'x12' }
  ];
}

export class Routes {
  static readonly baseUrl = 'http://127.0.0.1:8000'
}

export class Urls {
  static readonly notProductImgUrl = 'https://firebasestorage.googleapis.com/v0/b/mattimportauth.appspot.com/o/KiqnRM8uNDes7laeNxJPxVYugvy1%2F1708826271153?alt=media&token=50edbb81-f66e-46e8-b808-8bd0849dfd85'
  static readonly createSale = 'create-sale'
  static readonly clients = 'clients'
  static readonly notPaySalesByDate = 'not-pay-sales'
  static readonly editSales = 'alter-sale'
}
