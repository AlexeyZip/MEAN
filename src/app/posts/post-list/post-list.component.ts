import { Component, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy, OnChanges {

    public posts: Post[] = [];
    private postSub: Subscription;

   constructor(public postsService: PostsService) {}

   public ngOnInit(): void {
        this.postsService.getPosts();
        this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
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
}
