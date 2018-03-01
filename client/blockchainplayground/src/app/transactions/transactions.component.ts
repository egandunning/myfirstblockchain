import { Component, OnInit, Input } from '@angular/core';

import { Transaction } from '../transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input()
  transactions: Array<Transaction>;

  constructor() { }

  ngOnInit() {
  }

}
