import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
//  public posts = [
//     {
//         title: 'Post1',
//         content: 'Test content 1'
//     },
//     {
//         title: 'Post2',
//         content: 'Test content 2'
//     },
//     {
//         title: 'Post3',
//         content: 'Test content 3'
//     },
//  ]
    public posts: Post[] = [];
    private postSub: Subscription;

   constructor(public postsService: PostsService) {}

   ngOnInit(): void {
       this.postsService.getPosts();
       this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
            this.posts = posts;
       });
   }

   ngOnDestroy(): void {
        this.postSub.unsubscribe();
   }
}
