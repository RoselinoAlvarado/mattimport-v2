import { Component, Input, OnInit, inject, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, Users } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpService } from 'src/app/services/http.service';
import { Options, Urls } from 'src/app/util/consts';
import { Product, ProductSale } from 'src/app/models/productSales.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    image: new FormControl(''),
    productName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    paymentDate: new FormControl('', [Validators.required]),
    value: new FormControl(null, [Validators.required, Validators.min(4)]),
    paid: new FormControl(null, Validators.required),
    parcel: new FormControl(null, Validators.required),
    client: new FormControl(null, Validators.required),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  user = {} as User;
  http = inject(HttpService);
  clientsData: Users[];

  titleName: string;
  nameLabel: string = 'Nome do produto';
  valueLabel: string = 'Preço';
  dateLabel: string;
  paidLabel: string = 'Pagado';
  passwordLabel: string = 'Senha';
  isTrue = true;
  paidOptions = Options.paidOptions;
  parcelOptions = Options.parcelOptions;
  imageLabel: string;
  noImageName = '1708826271153';

  ngOnInit() {
    this.user = this.utilSvc.getFromLocalStorage('user');
    this.dateLabel = this.product ? 'Data da parcela atual' : 'Data da primeira parcela';
    this.imageLabel = this.product ? 'Atualizar imagem' : 'Tirar/Selecionar';
    this.titleName = this.product ? 'Atualizar venda' : 'Adicionar venda';
  }

  ionViewWillEnter() {
    this.getClientsData();
    if (this.product) {
      this.form.controls.productName.setValue(this.product.product_name);
      this.form.controls.paymentDate.setValue(this.product.payment_date);
      this.form.controls.value.setValue(this.product.value.toString());
      this.form.controls.paid.setValue(this.product.paid.toString());
      this.form.controls.image.setValue(this.product.product_img);
      this.form.controls.parcel.setValue(this.product.paid);
      this.form.controls.client.setValue(this.product.product_id);
    }
  }

  getClientsData() {
    this.http.getData(Urls.clients).subscribe({
      next: (data: Users[]) => {
        this.clientsData = data;
      },
      error: (error) => {
        console.error(error);
        this.utilSvc.presentToast({
          message: `Erro ao obter clientes: ${error.message}`,
          duration: 4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      },
    });
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen do produto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProductData();
      else this.submitProductData();
    }
  }

  async submitProductData() {
    const form = this.form.value;
    const loading = await this.utilSvc.loading();

    await loading.present();

    let dataUrl = form.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl: string;

    if (imagePath && dataUrl)
      imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    if (!imageUrl) imageUrl = Urls.notProductImgUrl;

    this.form.controls.image.setValue(imageUrl);

    const newSale: ProductSale = {
      user_id: form.client,
      product_name: form.productName,
      payment_date: form.paymentDate,
      value: form.value,
      paid: form.paid,
      parcel: form.parcel,
      product_img: imageUrl,
    };

    this.http.postData(Urls.createSale, newSale).subscribe({
      next: (response) => {
        if (response)
        this.utilSvc.dismissModal({ success: true });
        loading.dismiss();
        this.utilSvc.presentToast({
          message: 'Venda criada com sucesso',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      },
      error: async (error) => {
        console.error(error);
        if (imagePath && dataUrl) await this.firebaseSvc.deleteFile(imagePath);
        this.utilSvc.dismissModal({ success: false });
        loading.dismiss();
        this.utilSvc.presentToast({
          message: `Erro ao registar a venda: ${error.message}`,
          duration: 4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      },
    });
  }

  async updateProductData() {
    debugger;
    const loading = await this.utilSvc.loading();
    await loading.present();
    let imageUrl: string;
    let dataUrl = this.form.value.image;
    let imagePath: string;

    console.log(this.product.product_img);
    console.log(this.form.value.image);

    if (this.form.value.image !== this.product.product_img) {
      if (this.product.product_img.includes(this.noImageName)) {
        imagePath = `${this.user.uid}/${Date.now()}`;
        imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      } else {
        imagePath = await this.firebaseSvc.getFilePath(this.product.product_img);
        imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      }
      this.form.controls.image.setValue(imageUrl);
    }

    const form = this.form.value;
    const alterSale: Product = {
      product_name: form.productName,
      payment_date: form.paymentDate,
      value: form.value,
      paid: form.paid,
      product_img: imageUrl ? imageUrl : form.image,
    };

    this.http.putData(Urls.editSales, this.product.product_id, alterSale).subscribe({
      next: (response) => {
        if (response)
        this.utilSvc.dismissModal({ success: true });
        loading.dismiss();
        this.utilSvc.presentToast({
          message: 'Venda atualizada com sucesso',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      },
      error: (error) => {
        console.error(error);
        this.utilSvc.dismissModal({ success: false });
        loading.dismiss();
        this.utilSvc.presentToast({
          message: `Erro ao atualizadar a venda: ${error.message}`,
          duration: 4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      },
    });
  }
}
