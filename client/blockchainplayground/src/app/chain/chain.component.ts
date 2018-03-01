import { Component, OnInit } from '@angular/core';

import { BlockComponent } from '../block/block.component';
import { ChainService } from '../chain.service';
import { Block } from '../block';

@Component({
  selector: 'app-chain',
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.css']
})
export class ChainComponent implements OnInit {

  chain: Block[] = this.chainService.chain;

  constructor(private chainService: ChainService) { }

  ngOnInit() {
  }

}
