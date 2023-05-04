import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
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
    private mode: postMode;
    private postId: string;

    constructor(public postsService: PostsService, public route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = postMode.editMode;
                this.postId = paramMap.get('postId');
                this.postsService.getPostById(this.postId).subscribe(postData => {
                    this.selectedPost = {id: postData._id, title: postData.title, content: postData.content}
                });
            } else {
                this.mode = postMode.createMode;
                this.postId = null;
            }
        })
    }

    public onSavePost(form: NgForm): void {
        if (form.invalid) {
            return
        };
        if (this.mode === postMode.createMode) {
            this.postsService.addPost(form.value.title, form.value.content); 
            form.resetForm();
        } else {
            this.postsService.updatePost(this.postId ,form.value.title, form.value.content)
        }
    }
}
