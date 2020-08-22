import { Component, OnInit } from '@angular/core';
import { BooksService } from '../books.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Books } from '../Books.model';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-details-books',
  templateUrl: './details-books.component.html',
  styleUrls: ['./details-books.component.css']
})
export class DetailsBooksComponent implements OnInit {
  constructor(public booksService: BooksService, public authService: AuthService, public router: Router, public route: ActivatedRoute) { }
  public BooksId: string;
  Books: Books;
  userIsAuthenticated = false;
  userisAdmin: boolean;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userisAdmin = this.authService.getAdmin();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.adminListenerSubs = this.authService.getAdminListener().subscribe(isAdmin => {
      this.userisAdmin = isAdmin;
    });

    this.route.params.pipe(
      switchMap((params: Params) => {
        // tslint:disable-next-line: no-string-literal
        return this.booksService.getSinglePost(params['ID']);
      })
    ).subscribe((newBooks: Books) => {
      this.Books = {
        _id: newBooks._id,
        title: newBooks.title,
        description: newBooks.description,
        author: newBooks.author,
        type: newBooks.type,
        pages: newBooks.pages,
        imagePath: newBooks.imagePath
      };
    });
  }

  onDelete(id: string) {
    console.log(id);
    this.booksService.deletePost(id);
  }

}
