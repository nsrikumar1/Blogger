import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  c_post: Post;
  post_id: number;
  param_id: number;
  length: number;
  constructor(private bs : BlogService, private router: Router, private route: ActivatedRoute) 
  { 
    
    let id;
    
    let username = parseJWT(document.cookie).usr;
    //this.c_post=this.bs.getCurrentDraft();
    
    
    this.route.params.subscribe( posti =>
      {
          id = parseInt(posti.id);
          this.post_id =id;
          this.param_id = id;
          let username = parseJWT(document.cookie).usr;
          let holder2 = Promise.resolve(this.bs.fetchPosts(username));
          let post_list = [];
          let second;
          holder2.then(second =>
          {
            let len = second.length;
            this.length = len;
            if (len-1 >=0)
            {
              if (second[len-1].postid==-1)
              {
                id =  -1;
                this.post_id =-1;
              }
            }
            let holder = Promise.resolve(this.bs.getPost(username,this.post_id));
            let post;
    
            holder.then(post =>
            {
              let temp = post;
              post.created = new Date(temp.created);
              post.modified = new Date(temp.modified);
              this.c_post=post;
              console.log(this.c_post);
              let holder2= this.bs.getCurrentDraft();
              if (holder2)
              {
                if (holder2!=this.c_post)
                {
                  this.c_post=holder2;
                  console.log(this.c_post);
                }
              }
              this.bs.setCurrentDraft(this.c_post);
            
          
            
          
  
            });
      
          
      
          });
          
        
         
        });

  }

  ngOnInit(): void 
  {
    
  }

  save(): void
  {
    
    let username = parseJWT(document.cookie).usr;
    console.log(this.post_id);
    console.log(this.param_id);
    if (this.post_id==-1)
    {
      
      this.c_post.postid = this.param_id;
      this.post_id=this.param_id;
      this.bs.deletePost(username,-1);
      this.c_post.modified= new Date(Date.now());
      this.c_post.created= new Date(Date.now());
      this.bs.newPost(username,this.c_post);
    }
    else
    {
      this.c_post.modified= new Date(Date.now());
      this.bs.updatePost(username,this.c_post);
    }
    let holder = Promise.resolve(this.bs.fetchPosts(username));
    let post_list = [];
    if (holder)
    {
      holder.then(second =>
      {
        post_list = second;
        console.log(post_list);
        this.bs.sendQuery(post_list);
        
      });
    }
    this.bs.setCurrentDraft(this.c_post);
    //location.reload();
    
    
  }

  preview(): void
  {
    this.bs.setCurrentDraft(this.c_post);
    this.router.navigate(['/preview/', this.param_id]);
  }

  delete(): void
  {
    let username = parseJWT(document.cookie).usr;
    this.bs.deletePost(username,this.post_id);
    //location.reload();
    let holder = Promise.resolve(this.bs.fetchPosts(username));
    let post_list = [];
    if (holder)
    {
      holder.then(second =>
      {
        post_list = second;
        this.bs.sendQuery(post_list);
        this.router.navigate(['/']);
      });
    }
    else
      this.router.navigate(['/']);
    
    
  }
  toDate(date)
  {
    if (!date)
      return "";
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
