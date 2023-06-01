import fs from 'fs';
import * as hcl from 'hcl2-parser';
import { mapKeys, snakeCase } from 'lodash';
import path from 'path';
import { supabase, blogsSelect } from '@/lib/supabaseClient';
import { getSingleBlog } from './blogs/[slug]';

const optionalKeys = [
  'base_url',
  'title',
  'description',
  'language',
  'has_license',
  'category',
  'favicon',
  'generator',
  'indexed_at',
  'issn',
];

export async function getAllConfigs() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';
  const filePath = path.resolve('rogue-scholar.hcl');
  const hclString = fs.readFileSync(filePath);
  const configs = hcl
    .parseToObject(hclString)[0]
    .blog.map((config: { [x: string]: any; }) => {
      // enforce optional keys exist
      for (const key of optionalKeys) {
        config[key] = config[key] == null ? null : config[key];
      }
      return config;
    })
    .filter((config: { indexed_at: any; }) => {
      return env != 'production' || config.indexed_at;
    });

  return configs;
}

export async function getAllBlogs() {
  let { data, error } = await supabase.from('blogs').select(blogsSelect).order('title', { ascending: true })

  if (error) {
    console.log(error);
  } 
  if (data) {
    return data;
  }
};

export default async function handler(_, res) {
  let blogs = await getAllBlogs();

  res.statusCode = 200;
  res.json(blogs);
};
