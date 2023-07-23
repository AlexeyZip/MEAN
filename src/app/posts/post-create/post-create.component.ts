import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { postMode } from "../post.interface";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
    enteredTitle: string = '';
    enteredContent: string = '';
    selectedPost: Post;
    isLoading: boolean = false;
    form: FormGroup;
    imagePreview: string;
    private mode: postMode;
    private postId: string;
    private authStatusSub: Subscription;

    constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = postMode.editMode;
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPostById(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.selectedPost = {
                            id: postData._id,
                            title: postData.title,
                            content: postData.content,
                            imagePath: postData.imagePath,
                            author: postData.author
                        };
                    this.form.setValue({
                        title: this.selectedPost.title,
                        content: this.selectedPost.content,
                        image: this.selectedPost.imagePath
                    })
                });
            } else {
                this.mode = postMode.createMode;
                this.postId = null;
            }
        })
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }

    onSavePost(): void {
        this.isLoading = true;
        if (this.mode === postMode.createMode) {
            this.postsService.addPost(
                    this.form.value.title,
                    this.form.value.content,
                    this.form.value.image
                ); 
            this.form.reset();
        } else {
            this.postsService.updatePost(
                    this.postId,
                    this.form.value.title,
                    this.form.value.content,
                    this.form.value.image
                )
        }
    }

    onImagePicked(event: Event): void {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }
        reader.readAsDataURL(file);
    }
}
