
export interface IDiscussion {
  name: string,
  comments: IComment[];
}

export interface IComment {
  author: string,
  content: ICommentContent[],
  posted_At: Date
}

export type ICommentContent = ( IMention | IPlainText | IMedia | IPoll );
export type IPollContent = ( IMultipleChoicePoll | ITwoChoicePoll );

export enum CommentType {
  PLAIN_TEXT = 'Plain Text', MENTION = 'Mention', QUOTE = 'Quote', MEDIA = 'Media', POLL = 'Poll'
}

export enum PollStyle {
  MULTIPLE_CHOICE = 'Multiple Choice', AB = 'A or B'
}

export interface IMention {
  type: CommentType.MENTION;
  user: string;
}

export interface IPlainText {
  type: CommentType.PLAIN_TEXT;
  text: string;
}

export interface IMedia {
  type: CommentType.MEDIA;
  url: string;
}

export interface IPoll {
  type: CommentType.POLL;
  content: IPollContent;
}

export interface IMultipleChoicePoll {

  style: PollStyle.MULTIPLE_CHOICE;

  choices: {
    text: string,
    votes: number
  }[]
}

export interface ITwoChoicePoll {

  style: PollStyle.AB;

  left_choice: {
    text: string,
    votes: number
  };

  right_choice: {
    text: string,
    votes: number
  }
}
