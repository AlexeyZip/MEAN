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
    public totalPosts = 0;
    public postsPerPage = 2;
    public currentPage = 1;
    public pageSizeOptions = [1, 2, 5, 10];
    private postSub: Subscription;

   constructor(public postsService: PostsService) {}

   public ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postSub = this.postsService.getPostUpdateListener()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                this.posts = postData.posts;
            });
   }

    public ngOnChanges(changes: any) {
        console.log(changes);
    }

    public ngOnDestroy(): void {
        this.postSub.unsubscribe();
    }

    public onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
                this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    public onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);  
    }
}
