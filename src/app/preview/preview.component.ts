import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  c_post : Post;
  post_id : number;
  title : string;
  body: string;
  constructor(private bs : BlogService, private router: Router, private route: ActivatedRoute) 
  { 
    let id;
    console.log("test");
    let username = parseJWT(document.cookie).usr;
    this.route.params.subscribe( posti =>
      {
          id = (posti.id);
          this.post_id =id;
          this.c_post=this.bs.getCurrentDraft();
          if (this.post_id != this.c_post.postid && this.c_post.postid!=-1)
          {
            
              let holder = Promise.resolve(this.bs.getPost(username,this.post_id));
            
    
              holder.then(post =>
              {
                let temp = post;
                post.created = new Date(temp.created);
                post.modified = new Date(temp.modified);
                this.c_post=post;
                
                this.bs.setCurrentDraft(this.c_post);
            
                var reader = new Parser();
                var writer = new HtmlRenderer();
                this.title = writer.render(reader.parse(this.c_post.title));
                this.body = writer.render(reader.parse(this.c_post.body));
            
          
  
              });
            
          }
          else
          {
            var reader = new Parser();
            var writer = new HtmlRenderer();
            this.title = writer.render(reader.parse(this.c_post.title));
            this.body = writer.render(reader.parse(this.c_post.body));
          }
      });

      
  }

  ngOnInit(): void {
  }
  edit(): void {
    this.router.navigate(['/edit/', this.post_id]);
  }

}
function parseJWT(token) 
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
