-- Moje Sámoška — základní schéma katalogu produktů pro PostgreSQL / Supabase.
-- Spusťte v Supabase SQL Editoru. Primární klíč UUID se generuje automaticky.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  price numeric(10, 2) not null check (price >= 0),
  category text not null check (
    category in (
      'Pečivo',
      'Mléčné výrobky',
      'Uzeniny',
      'Ovoce a zelenina'
    )
  ),
  image_url text not null check (char_length(trim(image_url)) > 0),
  is_action boolean not null default false,
  in_stock boolean not null default true,
  stock_count integer not null default 0 check (stock_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Udržuje příznak dostupnosti v souladu s počtem kusů.
  constraint products_stock_status_consistency
    check (in_stock = (stock_count > 0))
);

create index if not exists products_category_idx
  on public.products (category);

create index if not exists products_is_action_idx
  on public.products (is_action)
  where is_action = true;

create index if not exists products_in_stock_idx
  on public.products (in_stock);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

comment on table public.products is
  'Produktový katalog pro web Moje Sámoška.';
comment on column public.products.stock_count is
  'Počet kusů skladem; nula znamená vyprodáno.';
