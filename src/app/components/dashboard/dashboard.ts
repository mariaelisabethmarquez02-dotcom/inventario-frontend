import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../services/products';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartConfiguration,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PieController,
  ArcElement
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PieController,
  ArcElement
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];

  currentDate = new Date();

  showAI = true;

  currentSearch = '';

  totalProducts = 0;
  criticalProducts = 0;
  expensiveProducts = 0;

  inventoryValue = 0;
  averagePrice = 0;

  technologyProducts = 0;
  accessoriesProducts = 0;

  criticalPercentage = 0;

  aiAnalysis = `
ANÁLISIS AUTOMATIZADO DEL INVENTARIO

El sistema monitorea continuamente los productos registrados.

Se recomienda revisar periódicamente los productos con bajo stock para evitar faltantes y pérdidas de venta.
`;

  // BARRAS
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Productos Totales',
      'Stock Crítico',
      'Productos Alto Valor'
    ],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Indicadores',
        backgroundColor: [
          '#0d6efd',
          '#dc3545',
          '#198754'
        ]
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  // PIE
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [
      'Tecnología',
      'Accesorios'
    ],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          '#0d6efd',
          '#ffc107'
        ]
      }
    ]
  };

  constructor(
    private productsService: Products,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadProducts();

    this.loadAIAnalysis();

    setInterval(() => {

      if(this.currentSearch === '') {

        this.loadProducts();

      }

      this.currentDate = new Date();

    }, 30000);

  }

  loadProducts() {

    this.productsService
      .getProducts()
      .subscribe((response: any) => {

        this.products = response.data || [];

        if(this.currentSearch === '') {

          this.filteredProducts = [...this.products];

        }

        this.totalProducts =
          this.products.length;

        this.criticalProducts =
          this.products.filter(
            (p:any)=> p.stock < 5
          ).length;

        this.expensiveProducts =
          this.products.filter(
            (p:any)=> p.price > 10000
          ).length;

        this.inventoryValue =
          this.products.reduce(
            (total:number,p:any)=>
              total + (p.price * p.stock),
            0
          );

        this.averagePrice =
          this.products.length > 0
          ? this.products.reduce(
              (total:number,p:any)=>
                total + p.price,
              0
            ) / this.products.length
          : 0;

        this.technologyProducts =
          this.products.filter(
            (p:any)=>
              p.category?.toLowerCase()
              .includes('tecn')
          ).length;

        this.accessoriesProducts =
          this.products.filter(
            (p:any)=>
              p.category?.toLowerCase()
              .includes('acces')
          ).length;

        this.criticalPercentage =
          this.totalProducts > 0
          ? (this.criticalProducts * 100)
              / this.totalProducts
          : 0;

        // BARRAS

        this.barChartData = {

          labels: [
            'Productos Totales',
            'Stock Crítico',
            'Productos Alto Valor'
          ],

          datasets: [
            {
              data: [
                this.totalProducts,
                this.criticalProducts,
                this.expensiveProducts
              ],

              label: 'Indicadores',

              backgroundColor: [
                '#0d6efd',
                '#dc3545',
                '#198754'
              ]
            }
          ]

        };

        // PIE

        this.pieChartData = {

          labels: [
            'Tecnología',
            'Accesorios'
          ],

          datasets: [
            {
              data: [
                this.technologyProducts,
                this.accessoriesProducts
              ],

              backgroundColor: [
                '#0d6efd',
                '#ffc107'
              ]
            }
          ]

        };

        this.cdr.detectChanges();

      });

  }

  loadAIAnalysis() {

    this.productsService
      .getProducts()
      .subscribe((response:any) => {

        this.productsService
          .getAIAnalysis(response.data)
          .subscribe({

            next: (aiResponse: any) => {

  this.aiAnalysis = `
📌 RECOMENDACIONES IA

• Reabastecer productos con stock menor a 5 unidades.

• Revisar productos de alto valor periódicamente.

• Mantener monitoreo constante del inventario.

• Riesgo general: ${
  this.criticalProducts > 0
    ? 'MEDIO'
    : 'BAJO'
}
`;

  this.cdr.detectChanges();

},

            error: () => {

              console.log(
                'Gemini no disponible'
              );

            }

          });

      });

  }

  searchProducts(event:any) {

    this.currentSearch =
      event.target.value.toLowerCase();

    this.filteredProducts =
      this.products.filter((p:any)=>

        p.name
          .toLowerCase()
          .includes(this.currentSearch)

        ||

        p.category
          .toLowerCase()
          .includes(this.currentSearch)

      );

  }

  filterCategory(category:string) {

    if(category === '') {

      this.filteredProducts =
        [...this.products];

      return;

    }

    this.filteredProducts =
      this.products.filter(
        (p:any)=>
          p.category === category
      );

  }

  exportInventory() {

    let csv =
      'ID,Nombre,Precio,Stock,Categoria\n';

    this.filteredProducts.forEach((p:any) => {

      csv +=
        `${p.id},${p.name},${p.price},${p.stock},${p.category}\n`;

    });

    const blob =
      new Blob(
        [csv],
        {
          type:'text/csv;charset=utf-8;'
        }
      );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download = 'inventario.csv';

    a.click();

    window.URL.revokeObjectURL(url);

  }

}