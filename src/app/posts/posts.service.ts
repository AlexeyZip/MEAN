import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, map } from "rxjs";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(): void {
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    }
                })
            }))
            .subscribe(transfomedPosts => {
                this.posts = transfomedPosts;
                this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }

    getPostById(postId: string) {
        return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
          'http://localhost:3000/api/posts/' + postId
        );
    }
    // getPostById(postId: string): Observable<Post> {
    //     return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
    //       'http://localhost:3000/api/posts/' + postId
    //     ).pipe(map(postData => ({ id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath })));
    // }

    addPost(title: string, content: string, image: File): void {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http
            .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
                const post: Post = 
                    {
                        id: responseData.post.id,
                        title: title,
                        content: content,
                        imagePath: responseData.post.imagePath
                    };
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });   
    }

    updatePost(postId: string, title: string, content: string): void {
        const post: Post = {id: postId, title, content, imagePath: null};
        this.http.put('http://localhost:3000/api/posts/' + postId, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostVersion = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostVersion] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }

    deletePost(postId: string): void {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}