import { type Request } from "express";

export type IImageUrls = string[];

export interface ICreateTimelapseRequest {
  imageUrls: IImageUrls;
}

export interface ITimelapseResult {
  message: string;
  url: string;
}

export interface IAuthenticatedRequest extends Request {
  user?: {
    uid: string;
  };
}

export interface IUser {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  country?: string;
  gender?: string;
  notificationTime?: string | null;
  birthday?: string;
  userTimeZone?: string;
}

export interface IObjective {
  objectiveId: string;
  title: string;
  date: string;
  completed: boolean;
  createdAt: string;
  endingDate: string;
  totalDays: number;
  startingDate: string;
  lastPhotoDate: string | null;
  principal: boolean;
  viewed?: boolean;
}

export interface IFile {
  fileId: string;
  url?: string;
  createdAt: string;
  empty?: boolean;
}
