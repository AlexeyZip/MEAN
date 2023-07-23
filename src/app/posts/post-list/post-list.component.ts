import { Component, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy, OnChanges {

    posts: Post[] = [];
    isLoading: boolean = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    userId: string;
    private postSub: Subscription;
    private authStatusSub: Subscription;

   constructor(public postsService: PostsService, private authService: AuthService) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postSub = this.postsService.getPostUpdateListener()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                this.posts = postData.posts;
            });
            this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
        });    
   }

    ngOnChanges(changes: any) {
        console.log(changes);
    }

    ngOnDestroy(): void {
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
                this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);  
    }
}
