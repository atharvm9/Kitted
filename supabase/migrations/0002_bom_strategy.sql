alter table boms
  add column strategy text check (strategy in ('lp', 'greedy')) default null;
