import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'amazom_eCommerce';
  registerObj: any = {
    "CustId": 0,
    "Name": "",
    "MobileNo": "",
    "Password": ""
  }
  loginObj: any = {
    "UserName": "",
    "UserPassword": ""
  }
  loggedObj: any = {};
  cartItems: any[]= [];
  loginModelClass: string = '';
  constructor(private productSrv: ProductService,private toastr: ToastrService) {
    const localData = localStorage.getItem('amazon_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
      this.getCartData(this.loggedObj.custId)
    }
    this.productSrv.cartUpdated.subscribe((res: boolean)=>{
      if(res) {
        this.getCartData(this.loggedObj.custId)
      }
    })
    this.productSrv.showLogin.subscribe((res: boolean)=>{
      if(res) {
         this.loginModelClass = 'show';
      }
    })
  }

  getCartData(id: number) {
    this.productSrv.getAddtocartdataByCust(id).subscribe((res: any)=>{
      this.cartItems = res.data;
    })
  }

  onRegister() {
    this.productSrv.register(this.registerObj).subscribe((res: any)=> {
      if(res.result) {
        this.loggedObj = res.data;
        this.toastr.success('bmd!', 'Création d\'utilisateur terminée!');
      } else {
        alert(res.message)
      }
    })
  }
  onLogin() {
    this.productSrv.login(this.loginObj).subscribe((res: any)=> {
      if(res.result) {
          this.toastr.success('bmd!', 'Connexion réussie de l\'utilisateur!');
        this.loggedObj = res.data;
        this.loginModelClass = '';
        localStorage.setItem('amazon_user', JSON.stringify(res.data));
        this.getCartData(this.loggedObj.custId)
      } else {
        alert(res.message)
      }
    })
  }
  removeItem(cartId: number) {
    this.productSrv.removeProductFromCart(cartId).subscribe((res: any)=> {
      if(res.result) {
        this.toastr.info('bmd!', 'Élément supprimé!');
        this.getCartData(this.loggedObj.custId)
      } else {
        alert(res.message)
      }
    })
  }

}
