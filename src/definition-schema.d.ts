/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Text = string;
export type FontSize = string;
export type FontWeight = number;
export type FontColor = string;
export type BackgroundColor = string;
export type Text1 = string;
export type FontSize1 = string;
export type FontWeight1 = number;
export type FontColor1 = string;
export type Text2 = string;
export type FontSize2 = string;
export type FontWeight2 = number;
export type FontColor2 = string;
export type BackgroundColor1 = string;

export interface TextboxConfiguration {
  title?: TitleSettings;
  subTitle?: SubtitleSettings;
  body?: BodySettings;
  [k: string]: unknown;
}
export interface TitleSettings {
  text?: Text;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  color?: FontColor;
  backgroundColor?: BackgroundColor;
  [k: string]: unknown;
}
export interface SubtitleSettings {
  text?: Text1;
  fontSize?: FontSize1;
  fontWeight?: FontWeight1;
  color?: FontColor1;
  [k: string]: unknown;
}
export interface BodySettings {
  text?: Text2;
  fontSize?: FontSize2;
  fontWeight?: FontWeight2;
  color?: FontColor2;
  backgroundColor?: BackgroundColor1;
  [k: string]: unknown;
}