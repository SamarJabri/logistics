import { Component, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  newComment: Comment = { message: '' };

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments().subscribe(data => {
      this.comments = data;
    });
  }

  submitComment(): void {
    if (!this.newComment.message.trim()) return;
    
    this.commentService.addComment(this.newComment).subscribe(() => {
      this.newComment.message = '';
      this.loadComments();
    });
  }
}