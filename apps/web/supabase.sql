-- Create blogs table
create table if not exists blogs (
  id text not null,
  title text not null,
  description text,
  language text,
  feed_format text,
  category text,
  license text,
  icon text,
  favicon text,
  generator text,
  feed_url text,
  home_page_url text,
  base_url text,
  user_id uuid not null references auth.users DEFAULT auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  indexed_at date
);
-- Enable row level security for blogs
alter table blogs enable row level security;
-- Create policy for clients that users can only create/read/update/delete their own clients
drop policy if exists "Users can only access their own blogs" on blogs;
create policy "Users can only access their own blogs" on blogs for all using (auth.uid() = user_id);
