import { Component, OnInit, Input } from '@angular/core';

import { Block } from '../block';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {

  //placeholder txn
  public transactions: Transaction[] = [
   new Transaction('me', 'you', 100, {location: 'WA'}),
   new Transaction('me', 'him', 10, {location: 'MN'}),
   new Transaction('you', 'me', 1000, {location: 'TX'})
  ];

  @Input()
  block: Block;

  constructor() { }

  ngOnInit() {
  }

}
