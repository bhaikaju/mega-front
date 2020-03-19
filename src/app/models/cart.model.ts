import {ProductModelServer} from "./product.model";

export interface CartModelServer {
  total: Number;
  data: [{
    product: ProductModelServer,
    numInCart: Number
  }];
}

export interface CartModelPublic {
  total: Number;
  prodData: [{
    id: Number,
    incart: Number
  }]
}
