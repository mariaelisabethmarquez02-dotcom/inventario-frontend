import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Products } from '../../services/products';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];

  searchTerm = '';

  editMode = false;

  productId = 0;

  categories = [
    'Tecnología',
    'Accesorios',
    'Periféricos'
  ];

  suppliers = [
    'HP México',
    'Samsung',
    'Lenovo',
    'Logitech'
  ];

  product = {
    name: '',
    description: '',
    price: null as any,
    stock: null as any,
    category: '',
    supplier: '',
    available: true
  };

  constructor(
    private productsService: Products,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {

    this.productsService
      .getProducts()
      .subscribe((response: any) => {

        this.products = response.data || [];

        this.filteredProducts = [...this.products];

        this.cdr.detectChanges();

      });

  }

  searchProducts(event: any) {

    const term = event.target.value.toLowerCase();

    this.filteredProducts = this.products.filter((p: any) =>

      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.supplier.toLowerCase().includes(term)

    );

  }

  saveProduct() {

  console.log(this.product);

  if (
    !this.product.name ||
    !this.product.description ||
    !this.product.category ||
    !this.product.supplier ||
    this.product.price === null ||
    this.product.stock === null
  ) {

      alert('Todos los campos son obligatorios');
      return;

    }

    if (this.editMode) {

      this.productsService
        .updateProduct(this.productId, this.product)
        .subscribe(() => {

          this.cancelEdit();
          this.loadProducts();

        });

      return;
    }

    this.productsService
      .createProduct(this.product)
      .subscribe(() => {

        this.loadProducts();
        this.clearForm();

      });

  }

  editProduct(product: any) {

    this.editMode = true;

    this.productId = product.id;

    this.product = {

      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      supplier: product.supplier,
      available: product.available

    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  deleteProduct(id: number) {

    if (confirm('¿Eliminar producto?')) {

      this.productsService
        .deleteProduct(id)
        .subscribe(() => {

          this.loadProducts();

          this.cdr.detectChanges();

        });

    }

  }

  cancelEdit() {

    this.editMode = false;
    this.productId = 0;

    this.clearForm();

  }

  clearForm() {

    this.product = {

      name: '',
      description: '',
      price: null,
      stock: null,
      category: '',
      supplier: '',
      available: true

    };

  }

}