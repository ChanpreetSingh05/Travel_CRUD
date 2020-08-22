import { Component, OnInit, OnDestroy } from '@angular/core';
import { Books } from '../Books.model';
import { BooksService } from '../books.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-get-books',
  templateUrl: './get-books.component.html',
  styleUrls: ['./get-books.component.css']
})
export class GetBooksComponent implements OnInit, OnDestroy {
  posts: Books[] = [];
  private BooksSub: Subscription;
  title: string;
  constructor(public booksService: BooksService) { }

  ngOnInit() {
    this.booksService.getPosts();
    this.BooksSub = this.booksService.getPostUpdateListener()
      .subscribe((post: Books[]) => {
        this.posts = post;
      });
  }

  ngOnDestroy(): void {
    this.BooksSub.unsubscribe();
  }

  onDelete(id: string) {
    console.log(id);
    this.booksService.deletePost(id);
  }


  Search() {
    if (this.title !== '') {
      this.posts = this.posts.filter(res => {
        return res.title.toLocaleLowerCase().match(this.title.toLocaleLowerCase());
      });
    } else if (this.title === '') {
      this.ngOnInit();
    }
  }

}
