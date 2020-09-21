
import { map } from 'rxjs/operators';
import { Component, OnInit, EventEmitter, NgZone } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../services/filter.service';
import { CategoryService } from '../services/category.service';
import { WishlistService } from '../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner'
import { CartService } from '../services/cart.service';
import { BooksService } from '../services/books.service';
declare var $: any;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  first: any = '100/200';
  second: any = '200/300';
  third: any = '300/400';
  fourth: any = '400/500';
  fifth: any = '500/10000';
  variant1: any = 'asc';
  variant: any = 'desc';
  book_sec = false;
  books$: any = [];
  totalBooks: number;
  pages: number = 1;
  bookId: any;
  wish$: any = [];
  wid: any = {};
  size: any = {};
  Error = false;
  message: any;
  length: any;
  wid1: number[] = [];
  pid: any = [];
  pid1: any = [];
  match: any;
  books: any = [];
  book$: any = [];
  cartitem: any = [];
  book1: any = [];
  cartquantity: any = [];
  cartquantity1: any = [];
  cartpid: any = {};
  cartpid1: any[] = [];
  token:string
  i:number
  constructor(
    private toastr: ToastrService,
    private CatService: CategoryService,
    private router: Router,
    private newService: BooksService,
    private route: ActivatedRoute,
    private filter: FilterService,
    private wish: WishlistService,
    private spinner: NgxSpinnerService,
    private cart: CartService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
  ) { }
  ngOnInit() {
    this.spinner.show()
    this.activatedRoute.params.subscribe(res => {
      this.token = res['token']
     if(this.token){
       console.log(this.token)
      localStorage.setItem("User",JSON.stringify(this.token))
      setTimeout(() => {
        this.ngZone.run(() => this.router.navigate(['/cart'])).then();  
      }, 2000);
      
     }else{
       console.log('Token From Mobile App Not Fetch ')
     }
    });
    this.loadfilter();
    this.wish.getwishlistload().subscribe(() => {
      this.loadwish();
    })
    this.cart.getcartload().subscribe(() => {
      this.loadcart();
    })
    this.loadcart();
    this.loadwish();
    this.loadcat();
    this.jquery_code();
    
  }
  jquery_code() { }
  loadbook() {
    this.newService.getBooks().pipe(
      map((resp)=>{
        var book = resp.books
        for (let i = 0; i < book.length; i++) {
        book[i]['mrp_inr'] = Math.floor(book[i]['mrp_inr']) 
        book[i]['rate'] = Math.floor(book[i]['rate']) 
        book[i]['weight'] = Math.floor(book[i]['weight']) 
        book[i]['sale_disc_inr'] = Math.floor(book[i]['sale_disc_inr']) 
        book[i]['sale_disc_per'] = Math.floor(book[i]['sale_disc_per'])
        book[i]['discount_per'] = Math.floor(book[i]['discount_per']) 
        book[i]['discount_rs'] = Math.floor(book[i]['discount_rs'])
        book[i]['final_price'] = Math.floor(book[i]['final_price'])
        book[i]['sale_rate'] = Math.floor(book[i]['sale_rate'])
        book[i]['sale_price'] = Math.floor(book[i]['sale_price'])
        book[0]['sale_price'] = 0 
        }
        return resp
      })
    ).subscribe((data) => {
      this.books$ = data;
      const pid = data.books;
      for (var { _id: id } of pid) {
        this.pid1.push(id);
      }
      this.totalBooks = data.totalBooks;
      console.log(this.totalBooks)
      this.pages = 1;
      this.spinner.hide();
    });
  }
  loadcat() {
    this.CatService.getCategoryById(this.route.snapshot.params._id).subscribe(
      (res) => {
        this.books$ = res;
        if(this.books$.success == false || this.books$.totalBooks ==0){
          this.loadsubcat()
        }
      console.log(this.books$)
        if(this.books$.totalBooks!=0){this.spinner.hide()}
      }
    );

  }

  loadsubcat(){
    this.CatService.getSubCatById(this.route.snapshot.params._id).subscribe(
      (res) => {
        this.books$ = res;
        if(this.books$.success == false){
          this.spinner.hide(); 
          alert('nothing Available')
        }
      console.log(this.books$)
        if(this.books$.totalBooks!=0){this.spinner.hide()}
      },(error)=>{
        if(error){
          this.spinner.hide();
          alert('nothisn')
        }
      }
    );
  }
  /* Set the width of the side navigation to 250px */
  public openNav() {
    $('#mySidenav').css('width', '400px');
  }
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }
  on() {
    document.getElementById('overlay').style.display = 'block';
  }
  off() {
    document.getElementById('overlay').style.display = 'none';
  }
  filters(modal: String) {
    this.filter.priceDefine(modal).subscribe((res) => {
      this.books$ = res;
      console.log(this.books$)
      if(this.books$.totalBooks!=0){this.spinner.hide()}
    });
  }
  filtersSort(variant: String) {
    this.filter.sortBy(variant).subscribe((res) => {
      this.books$ = res;
      console.log(this.books$)
      if(this.books$.totalBooks!=0){this.spinner.hide()}
    });
  }
  onPageChange(page: number) {
    this.pages = page;
    window.scrollTo(0, 520);
  }
  loadfilter() {
    if (this.router.url == '/books/sortBy100/200') {
      this.filters(this.first);
    }
    if (this.router.url == '/books/sortBy200/300') {
      this.filters(this.second);
    }
    if (this.router.url == '/books/sortBy300/400') {
      this.filters(this.third);
    }
    if (this.router.url == '/books/sortBy400/500') {
      this.filters(this.fourth);
    }
    if (this.router.url == '/books/sortBy500') {
      this.filters(this.fifth);
    }
    if (this.router.url == '/books') {
      this.loadbook();
    }
    if (this.router.url == '/books/sortByasc') {
      this.filtersSort(this.variant1);
    }
    if (this.router.url == '/books/sortBydesc') {
      this.filtersSort(this.variant);
    }
  }
  public price() {
    this.router.navigate(['books/sortBy100/200']);
  }
  public price1() {
    this.router.navigate(['books/sortBy200/300']);
  }
  public price2() {
    this.router.navigate(['books/sortBy300/400']);
  }
  public price3() {
    this.router.navigate(['books/sortBy400/500']);
  }
  public price4() {
    this.router.navigate(['books/sortBy500']);
  }
  public lowTohigh() {
    this.router.navigate(['books/sortByasc']);
  }
  public highTolow() {
    this.router.navigate(['books/sortBydesc']);
  }
  loadwish() {
    if (localStorage.getItem('User') != null) {
      this.wish.getwish().subscribe((data) => {
        this.wish$ = data;
        const size = this.wish$.books;
        for (var { book: books } of size) {
          this.wid = books;
          const size1 = books._id;
          this.wid1.push(size1);
        }
      });
    }
  }
  loadcart() {
    if (localStorage.getItem('User') != null) {
      this.cart.getCart().subscribe((data) => {
        this.book$ = data;
        if (this.book$.cartItems.length > 0) {

          this.cartitem = this.book$.cartItems[0].cart;
          this.length = this.cartitem.length;
        }
        if (this.book$.cartItems.length > 0) {
          this.cartquantity = this.book$.cartItems[0].cart;

          for (var { book: books } of this.cartquantity) {
            this.cartpid = books;
            const size3 = books._id;
            this.cartpid1.push(size3);
          }
        }
      });
    }
  }
}
