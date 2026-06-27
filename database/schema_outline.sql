-- LISSO ShishaOS initial schema outline
-- This is not final production SQL. Use it as a design reference.

CREATE TABLE brands (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE flavors (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  name TEXT NOT NULL,
  jp_name TEXT,
  category TEXT,
  sensory_note TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  taste_vector JSONB NOT NULL DEFAULT '{}',
  structure JSONB NOT NULL DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  good_with TEXT[] DEFAULT '{}',
  avoid TEXT[] DEFAULT '{}',
  mixology_notes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_inventory (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  flavor_id UUID REFERENCES flavors(id),
  grams_left NUMERIC,
  owned BOOLEAN DEFAULT true,
  favorite BOOLEAN DEFAULT false,
  memo TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  concept TEXT,
  total_grams NUMERIC,
  public_slug TEXT UNIQUE,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE recipe_items (
  id UUID PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id),
  flavor_id UUID REFERENCES flavors(id),
  grams NUMERIC NOT NULL,
  layer TEXT,
  role TEXT,
  notes TEXT
);

CREATE TABLE recipe_remixes (
  id UUID PRIMARY KEY,
  original_recipe_id UUID REFERENCES recipes(id),
  user_id UUID REFERENCES users(id),
  reconstruction_score NUMERIC,
  converted_recipe_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  flavor_id UUID REFERENCES flavors(id),
  name TEXT NOT NULL,
  sku TEXT,
  price INTEGER,
  stock_status TEXT,
  product_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE ai_reviews (
  id UUID PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  input_text TEXT,
  ai_output JSONB,
  status TEXT DEFAULT 'pending',
  reviewer_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  reviewed_at TIMESTAMP
);
