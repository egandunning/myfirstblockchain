import { Transaction } from './transaction';

export class Block {

   constructor(
      public index: number,
      public createdAt: string,
      public proof: number,
      public hash: string,
      public transactions: Array<Transaction>
   ) { }
}
