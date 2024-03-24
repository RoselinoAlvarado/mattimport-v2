import { Product } from './../../../models/productSales.model';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductSalesByUser } from 'src/app/models/productSales.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Urls } from 'src/app/util/consts';
import { getCurrentMonthAndYear } from 'src/app/util/utilMethods';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  form = new FormGroup({
    date: new FormControl('')
  });
  titleName: string = 'Home';
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  http = inject(HttpService);
  productsData: ProductSalesByUser[] = [];
  year: string;
  month: string;
  isModalOpen = false;
  selectedProductData: ProductSalesByUser;
  headerContent = 'O cliente pagou?';
  dateLabel = 'Buscar por mês e ano';
  loading = false;
  esqueletonData = [1, 1, 1 , 1 , 1 , 1, 1]

  ngOnInit() {
  }

  async sendAlert(product: Product) {
    try {
      const success = await this.utilSvc.presentAlert(this.headerContent);
      if (success) {
        await this.paidSale(product);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async paidSale(product: Product) {
    const loading = await this.utilSvc.loading();
    await loading.present();
    const { product_id, ...productData } = product;
    productData.paid = 1;

    this.http.putData(Urls.editSales, product_id, productData).subscribe({
      next: (response) => {
        if (response)
        loading.dismiss();
        this.utilSvc.presentToast({
          message: 'Venda atualizada com sucesso',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.getProductsByDate();
      },
      error: (error) => {
        console.error(error);
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

  ionViewWillEnter() {
    this.getProductsByDate();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProductsByDate();
      event.target.complete();
    }, 1000);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setData(productData: ProductSalesByUser) {
    this.selectedProductData = productData;
  }

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  async searchByDate() {
    try {
      const loading = await this.utilSvc.loading();
      await loading.present();

      if (this.form.value.date) {
        const [year, month] = this.form.value.date.split('-');
        this.getProductsByDate(year, month)
      }
      loading.dismiss();
      this.utilSvc.presentToast({
        message: 'Dados consultados com sucesso',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error(error);
      this.utilSvc.presentToast({
        message: `Erro ao trazer os dados das vendas: ${error.message}`,
        duration: 4500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }


  }

  getProductsByDate(year?: string, month?: string) {
    this.loading = true;
    if (!month || !year) {
      [this.month, this.year] = getCurrentMonthAndYear();
    } else {
      this.month = month;
      this.year = year;
    }

    this.http.getData(`${Urls.notPaySalesByDate}?month=${this.month}&year=${this.year}`).subscribe({
      next: (data: ProductSalesByUser[]) => {
        this.productsData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.utilSvc.presentToast({
          message: `Erro ao obter as vendas: ${error.message}`,
          duration: 4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      },
    });
  }

  async addUpdateProduct(product?: Product) {
    let success = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    });
    if (success) {
      this.getProductsByDate();
    }
  }
}
