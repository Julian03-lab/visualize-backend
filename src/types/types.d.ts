export type IImageUrls = string[];

export interface ICreateTimelapseRequest {
  imageUrls: IImageUrls;
}

export interface ITimelapseResult {
  message: string;
  url: string;
}
