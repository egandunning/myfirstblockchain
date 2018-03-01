import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BlockComponent } from './block/block.component';
import { ChainComponent } from './chain/chain.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ChainService } from './chain.service';


@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    ChainComponent,
    TransactionsComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ChainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
