create extension if not exists "uuid-ossp";

create table boms (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table bom_items (
  id               uuid primary key default uuid_generate_v4(),
  bom_id           uuid not null references boms(id) on delete cascade,
  manufacturer_pn  text not null,
  quantity         integer not null check (quantity > 0),
  description      text
);

create index bom_items_bom_id_idx on bom_items(bom_id);
