create extension if not exists "pgcrypto";

create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('market', 'parlay', 'syndicate')),
  market text not null,
  side text not null,
  amount numeric(38, 18) not null check (amount >= 0),
  payout numeric(38, 18) not null default 0 check (payout >= 0),
  status text not null default 'Active' check (status in ('Active', 'Resolved')),
  result text null check (result in ('YES', 'NO')),
  tx_hash text null,
  details text null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists bets_user_id_created_at_idx
  on public.bets (user_id, created_at desc);

alter table public.bets enable row level security;

create policy "Users can view their own bets"
  on public.bets
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own bets"
  on public.bets
  for insert
  to authenticated
  with check (auth.uid() = user_id);
