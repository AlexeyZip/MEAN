import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean';
  public storedPosts = [];

  public onPostAdded(post: any): void {
    this.storedPosts.push(post);
  }
}
