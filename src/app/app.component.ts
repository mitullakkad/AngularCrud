import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Constants} from './untils/constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AngularCrud';
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  pageSizes = Constants.pageSize[5] ;//pageinator

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private dialog: MatDialog, private api: ApiService) { }
  ngOnInit(): void {
    this.getAllProducts();
  }


  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllProducts();
      }
    })
  }/**
   * @author : Mitullakkad
   * @discription : To open a dialogbox for add product
   */

  getAllProducts() {
    this.api.getProduct()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("Error will fatching the Records!!");
        }
      })
  }/**
   * @author : Mitullakkad
   * @discription : Get all product data  
   */



  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllProducts();
      }
    })
  }/**
   * @author : Mitullakkad
   * @discription : edit product data to show edit dialogbox
   */


  deleteProduct(id: number) {
    this.api.deleteProduct(id)
      .subscribe({
        next: (res) => {
          alert("Product Deleted Successfully!");
          this.getAllProducts();
        },
        error: () => {
          alert("Error while deleting the product!!!");
        }
      })
  }/**
   * @author : Mitullakkad
   * @discription : Delete product data
   */


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
