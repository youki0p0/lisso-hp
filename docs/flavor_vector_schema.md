# Flavor Vector Schema

Each flavor should have human-readable notes and numerical sensory vectors.

## Core fields

```yaml
brand: string
name: string
jp_name: string | null
category: string
status: draft | ai_parsed | human_verified | public | archived
```

## Sensory Note

```yaml
sensory_note: string
```

## Taste Vector

Scale: 0 to 10 unless otherwise specified.

```yaml
taste_vector:
  sweetness: number
  acidity: number
  bitterness: number
  cooling: number
  cold_impression: number
  body: number
  aroma_strength: number
  creaminess: number
  fruitiness: number
  floral: number
  herbal: number
  tea: number
  spice: number
  saltiness: number
  roast: number
  candy_like: number
  naturalness: number
  aftertaste: number
  volatility: number
  heat_resistance: number
```

## Example

```yaml
brand: BLACKBURN
name: Peach Yogurt
jp_name: ピーチヨーグルト
status: human_verified

sensory_note: >
  お菓子のモロッコヨーグルのような甘みの強いヨーグルト。
  酸味も感じる。
  ピーチの甘酸っぱさが後味で3割程度乗ってくる。
  清涼感はないが、冷たさは感じる。

taste_vector:
  sweetness: 8.5
  acidity: 4.5
  bitterness: 0.5
  cooling: 0
  cold_impression: 3
  body: 7
  aroma_strength: 7
  creaminess: 7.5
  fruitiness: 4
  floral: 0
  herbal: 0
  tea: 0
  spice: 0
  saltiness: 0
  roast: 0
  candy_like: 7
  naturalness: 3
  aftertaste: 6
  volatility: 5
  heat_resistance: 7

structure:
  main_note: sweet_yogurt
  sub_note: peach
  ratio_impression:
    yogurt: 70
    peach: 30

roles:
  - dessert_base
  - sweet_body
  - yogurt_connector
  - beginner_friendly

good_with:
  - Lemon
  - Green Tea
  - Vanilla
  - Pear
  - Raspberry
  - White Tea

avoid:
  - Strong Mint
  - Heavy Cream in large amount
  - Peanut in large amount
```
