import { Component, Input } from "@angular/core";
import { Post } from "../post.model";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
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
   @Input() public posts: Post[] = [];
}
