import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, map } from "rxjs";

import { Post } from "./post.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const  BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number): void {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
            .pipe(map((postData) => {
                return {
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            author: post.author
                        }
                    }),
                    maxPosts: postData.maxPosts
                }
            }))
            .subscribe(transfomedPostsData => {
                this.posts = transfomedPostsData.posts;
                this.postsUpdated.next({
                    posts: [...this.posts], 
                    postCount: transfomedPostsData.maxPosts
                });
        });
    }

    getPostUpdateListener(): Observable<{posts:Post[], postCount: number}> {
        return this.postsUpdated.asObservable();
    }

    getPostById(postId: string) {
        return this.http.get<{ _id: string; title: string; content: string, imagePath: string, author: string }>(
            BACKEND_URL + postId
        );
    }

    addPost(title: string, content: string, image: File): void {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http
            .post<{message: string, post: Post}>(BACKEND_URL, postData)
            .subscribe((responseData) => {
                this.router.navigate(["/"]);
            });   
    }

    updatePost(postId: string, title: string, content: string, image: File | string): void {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append("id", postId)
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {
            postData = {
                id: postId,
                title: title,
                content: content,
                imagePath: image,
                author: null
            };
        }
        this.http.put(BACKEND_URL + postId, postData)
            .subscribe(response => {
                this.router.navigate(["/"]);
            });
    }

    deletePost(postId: string): any {
        return this.http.delete(BACKEND_URL + postId);
    }
}