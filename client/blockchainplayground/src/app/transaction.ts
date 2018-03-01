export class Transaction {

   constructor(
         public sender: string,
         public recipient: string,
         public amount: number,
         public data: Object)
   {
      this._prettyData = JSON.stringify(data);
   }
}
