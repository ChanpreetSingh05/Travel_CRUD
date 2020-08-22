import { Injectable } from '@angular/core';
import { Books } from './Books.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private books: Books[] = [];
  private booksUpdated = new Subject<Books[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>(
      'http://localhost:3000/api/Books'
    )
      .pipe(map((postData) => {
        return postData.posts.map((post) => {
          return {
            _id: post._id,
            title: post.title,
            description: post.description,
            author: post.author,
            type: post.type,
            pages: post.pages,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(TransformedData => {
        this.books = TransformedData;
        this.booksUpdated.next([...this.books]);
      });
  }

  getPostUpdateListener() {
    return this.booksUpdated.asObservable();
  }

  getSinglePost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      author: string;
      type: string;
      pages: string;
      imagePath: string;
    }>
      ('http://localhost:3000/api/Books/' + id);
  }

  updatePost(postId: string, title: string, description: string, author: string, type: string, pages: string, image: File | string) {
    // tslint:disable-next-line: object-literal-shorthand
    // const post: Books = { _id: postId, title: title, description: description, price: price, country: country };
    let postData: Books | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('description', description);
      postData.append('author', author);
      postData.append('type', type);
      postData.append('pages', pages);
      postData.append('image', image, title);
      // postData.append('image', image, 'review');
    } else {
      postData = {
        _id: postId,
        title,
        description,
        author,
        type,
        pages,
        imagePath: image
      };
    }
    console.log('heyy ypo ' + image);
    this.http.put('http://localhost:3000/api/Books/' + postId, postData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/list']);
      });
  }

  addPost(title: string, description: string,
          author: string, type: string,
          pages: string, image: File) {
    // console.log('Helo ' + formdata);
    // tslint:disable-next-line: object-literal-shorthand
    // const post: any = { _id: null, title: title, description: description, price : price, country: country, formdata: formdata.getAll };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('author', author);
    postData.append('type', type);
    postData.append('pages', pages);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Books }>
      ('http://localhost:3000/api/Books', postData)
      .subscribe(responseData => {
        console.log(responseData.message);
        // const id = responseData.postID;
        this.router.navigate(['/admin']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/Books/' + postId)
      .subscribe(() => {
        const updatedPosts = this.books.filter(post => post._id !== postId);
        this.books = updatedPosts;
        this.booksUpdated.next([...this.books]);
        this.router.navigate(['/admin']);
      });
  }

}
