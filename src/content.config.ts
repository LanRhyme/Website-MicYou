import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// 空的内容集合配置，用于消除 "Content config not loaded" 警告
// 如果将来需要使用内容集合，可以在这里添加配置
export const collections = {};