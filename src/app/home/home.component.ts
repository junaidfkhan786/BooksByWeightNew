import { Component, OnInit } from '@angular/core';
import { BooksService } from '../services/books.service';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
book:any = []
  constructor(
    public books : BooksService
  ) { }

  ngOnInit(): void {


    this.jquery_code();
  }
  jquery_code() {


  }

}
