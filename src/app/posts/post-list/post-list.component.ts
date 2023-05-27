import { Component, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy, OnChanges {

    public posts: Post[] = [];
    public isLoading: boolean = false;
    public totalPosts = 10;
    public postsPerPage = 2;
    public pageSizeOptions = [1, 2, 5, 10];
    private postSub: Subscription;

   constructor(public postsService: PostsService) {}

   public ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts();
        this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
            this.isLoading = false;
            this.posts = posts;
        });
   }

    public ngOnChanges(changes: any) {
        console.log(changes);
    }

    public ngOnDestroy(): void {
        this.postSub.unsubscribe();
    }

    public onDelete(postId: string) {
       this.postsService.deletePost(postId);
    }

    public onChangePage(pageData: PageEvent) {
        console.log(pageData);
        
    }
}
