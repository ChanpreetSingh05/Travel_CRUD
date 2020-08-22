import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { BooksService } from '../books.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Books } from '../Books.model';

@Component({
  selector: 'app-create-books',
  templateUrl: './create-books.component.html',
  styleUrls: ['./create-books.component.css']
})
export class CreateBooksComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Books;
  form: FormGroup;
  multipleImages = [];
  imagePreview: string;
  btn = ' ';

  constructor(public booksService: BooksService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      author: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      type: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      pages: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      image: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('ID')) {
        this.mode = 'edit';
        this.postId = paramMap.get('ID');
        this.booksService.getSinglePost(this.postId).subscribe(postData => {
          this.post = {
            _id: postData._id,
            title: postData.title,
            description: postData.description,
            author: postData.author,
            type: postData.type,
            pages: postData.pages,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            description: this.post.description,
            author: postData.author,
            type: postData.type,
            pages: postData.pages,
            image: this.post.imagePath
          });
        });
        this.btn = 'Edit Country Info';
      } else {
        this.mode = 'create';
        this.btn = 'Add Country';
        this.postId = null;
      }
    });
  }

  createNewBooks() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.booksService.addPost(this.form.value.title,
        this.form.value.description,
        this.form.value.author,
        this.form.value.type,
        this.form.value.pages,
        this.form.value.image);
    } else {
      this.booksService.updatePost(this.postId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.author,
        this.form.value.type,
        this.form.value.pages,
        this.form.value.image);
    }

    this.form.reset();
  }


  selectMultipleImage(event) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
      // console.log(this.multipleImages);
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
