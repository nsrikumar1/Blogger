import { Injectable, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})

export class BlogService {
  draft: Post;

  constructor(private http: HttpClient) { 
    this.draft = null;
  }

  callback = null;


  subscribe(callback)
  {
    this.callback = callback;  
  }

  sendQuery(query: Post[]) 
  {
    this.processDelete(query);
  
  }
  processDelete(posts)
  {
    if (this.callback) this.callback(posts);
  }
  async fetchPosts(username: string): Promise<Post[]>{
    return fetch(`/api/${username}`).then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }
      return response.json() as Promise<Post[]>
    })
  };

  async getPost(username: string, postid: number): Promise<Post>{
    return fetch(`/api/${username}/${postid}`).then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }
      return response.json() as Promise<Post>
    })
  };

  async newPost(username: string, post: Post): Promise<void>{
    return fetch(`/api/${username}/${post.postid}`,
      {
        method: 'POST',
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({body: post.body, title: post.title}),
      }
    ).then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }
      return response.json() as Promise<void>
    })
  };

  async updatePost(username: string, post: Post): Promise<void>{
    
    return fetch(`/api/${username}/${post.postid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({body: post.body, title: post.title}),
      }
    ).then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }
      return response.json() as Promise<void>
    })
  };

  async deletePost(username: string, postid: number): Promise<void>{
    return fetch(`/api/${username}/${postid}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: null,
      }
    ).then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }
      return response.json() as Promise<void>
    })
  };
  
  setCurrentDraft(post: Post): void {
    this.draft = post;
    return null as void; 
  };

  getCurrentDraft(): Post {
    return this.draft as Post;
  };

}
