import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { postMode } from "../post.interface";
import { Post } from "../post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    public enteredTitle: string = '';
    public enteredContent: string = '';
    public selectedPost: Post;
    public isLoading: boolean = false;
    public form: FormGroup;
    private mode: postMode;
    private postId: string;

    constructor(public postsService: PostsService, public route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required]
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
                            id: postData.id,
                            title: postData.title,
                            content: postData.content
                        };
                    this.form.setValue({
                        title: this.selectedPost.title,
                        content: this.selectedPost.content
                    })
                });
            } else {
                this.mode = postMode.createMode;
                this.postId = null;
            }
        })
    }

    public onSavePost(): void {
        if (this.form.invalid) {
            return
        };
        this.isLoading = true;
        if (this.mode === postMode.createMode) {
            this.postsService.addPost(this.form.value.title, this.form.value.content); 
            this.form.reset();
        } else {
            this.postsService.updatePost(this.postId ,this.form.value.title, this.form.value.content)
        }
    }

    public onImagePicked(event: Event): void {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
    }
}
