import { Component } from "@angular/core";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    public newPost: string = 'NO CONTENT';
    public enteredValue: string = '';
  public onAddPost(): void {
    this.newPost = this.enteredValue;
  }
}
