import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductService} from './product.service';
import {OrderService} from './order.service';
import {environment} from '../../environments/environment';
import {CartModelPublic, CartModelServer} from '../models/cart.model';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {ProductModelServer} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private serverURL = environment.SERVER_URL;

  // Data variable to store the cart information on the client's local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  };

  // Data variable to store cart information on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };

  /* OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE*/
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router) {

      this.cartTotal$.next(this.cartDataServer.total);
      this.cartData$.next(this.cartDataServer);

    //  Get the information from local storage ( if any )
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //  Check if the info variable is null or has some data in it

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
    //  Local Storage is not empty and has some information
      this.cartDataClient = info;

    //  Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
           if (this.cartDataServer.data[0].numInCart === 0) {
             this.cartDataServer.data[0].numInCart = p.incart;
             this.cartDataServer.data[0].product = actualProductInfo;
             // TODO Create CalculateTotal Function and replace it here
             this.cartDataClient.total = this.cartDataServer.total;
             localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
           } else {
             // CartDataServer already has some entry in it
             this.cartDataServer.data.push({
               numInCart: p.incart,
               product: actualProductInfo
             });
             // TODO Create CalculateTotal Function and replace it here
             this.cartDataClient.total = this.cartDataServer.total;
             localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
           }
           this.cartData$.next({...this.cartDataServer});
        });
      });

    }

  }








}
