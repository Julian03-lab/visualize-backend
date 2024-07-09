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
