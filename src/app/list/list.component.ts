import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})


export class ListComponent implements OnInit {
  post_list: Post[];
  max_id: number;
  constructor(private bs : BlogService,  private router: Router) 
  { 
    
  }

  ngOnInit(): void 
  {
    this.bs.subscribe((suggestions) => { this.post_list = suggestions; });
    
    let username = parseJWT(document.cookie).usr;
    
    
    let holder = Promise.resolve(this.bs.fetchPosts(username));
    this.post_list = [];
    let second;
    if (holder)
    {
      holder.then(second =>
      {
      
        let len = second.length;
        if (len-1 >=0)
        {
         if (second[len-1].postid==-1)
         {
           this.bs.deletePost(username,-1);
           second.pop();
         }
        } 

        this.post_list = second;
        this.bs.subscribe((suggestions) => { this.post_list = suggestions; });

      });
    }
    // location.reload();
    
    
  }
  openPost(postid)
  {
    let username = parseJWT(document.cookie).usr;
  
    let holder = Promise.resolve(this.bs.getPost(username,postid));
    let post;
    
    holder.then(post =>
      {
        
        this.bs.setCurrentDraft(post);
        
  
      });
      this.router.navigate(['/edit/', postid]);
  }
  newPost(): void
  {
    let username = parseJWT(document.cookie).usr;
    let i = this.post_list.length -1;
    let postid=1;
    if (i!=-1)
    {
      postid = this.post_list[i].postid + 1;
    }
    
    let created = new Date(Date.now());
    let blank ="";
    let post =  {postid: -1, created: created, modified: null,title: blank,body:blank};
    this.bs.setCurrentDraft(post);
    this.bs.newPost(username,post);
    
    this.router.navigate(['/edit/', postid]);
  }

  toDate(date)
  {
    let date1 = new Date(date);
    return date1 ;
  }
}
function parseJWT(token) 
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}

