import { Injectable } from '@angular/core';

import { Block } from './block';
import { Transaction } from './transaction';

@Injectable()
export class ChainService {

  public chain: Block[] = [
    new Block(
      0,
      new Date().toString(),
      1,
      'ldskfjslkf',
      [
        new Transaction('fred', 'me', 1000, {location: 'WA'}),
        new Transaction('me', 'john', 10, {location: 'TX'})
      ]
    ),
    new Block(
      1,
      new Date().toString(),
      234,
      'lkdsjiwe',
      [
        new Transaction('me', 'sue', 1, {location: 'MN'})
      ]
    ) 
  ];

  constructor() { }

  getChain() {
    return this.chain;
  }
}
