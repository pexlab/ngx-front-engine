import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import {PartialChartTheme} from './line-chart.theme'

@FeComponent('lineChart')
@Component({
  selector: 'fe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  constructor(
      public hostElement: ElementRef,
  ) { }

    @Input()
    public feTheme!: ComponentTheme<PartialChartTheme>;

  ngOnInit(): void {
  }

}
