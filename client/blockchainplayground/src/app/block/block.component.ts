import { Component, OnInit, Input } from '@angular/core';

import { Block } from '../block';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {

  @Input()
  block: Block;

  public visible: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  public toggleVisiblity() {
    this.visible = !this.visible;
  }
}
