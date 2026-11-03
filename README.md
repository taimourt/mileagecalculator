# Mileage Calculator Pro 🚗⚡📐✈️🌐

An enterprise-grade, comprehensive **Multilingual Mileage, Map Distance, Gas MPG, IFTA Trucking, Car Lease PCP, and IRS Tax Reimbursement Suite** supporting **11 World Languages** with **121 separately indexable pages**.

---

## 🌐 Multilingual Engine & Internationalization (11 Languages)

The platform features a **native Language Converter in the header** allowing instantaneous switching between 11 major world languages:

| Flag | Language | Native Name | Code | Direction | Sample Indexable URL |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 🇺🇸 | **English** | English | `en` | LTR | `http://localhost:3000/#/en/route` |
| 🇪🇸 | **Spanish** | Español | `es` | LTR | `http://localhost:3000/#/es/mileage` |
| 🇫🇷 | **French** | Français | `fr` | LTR | `http://localhost:3000/#/fr/trip` |
| 🇩🇪 | **German** | Deutsch | `de` | LTR | `http://localhost:3000/#/de/irs` |
| 🇮🇹 | **Italian** | Italiano | `it` | LTR | `http://localhost:3000/#/it/measure` |
| 🇧🇷 | **Portuguese** | Português | `pt` | LTR | `http://localhost:3000/#/pt/lease` |
| 🇷🇺 | **Russian** | Русский | `ru` | LTR | `http://localhost:3000/#/ru/ifta` |
| 🇨🇳 | **Chinese** | 中文 (简体) | `zh` | LTR | `http://localhost:3000/#/zh/convert` |
| 🇯🇵 | **Japanese** | 日本語 | `ja` | LTR | `http://localhost:3000/#/ja/air` |
| 🇸🇦 | **Arabic** | العربية | `ar` | **RTL** | `http://localhost:3000/#/ar/route` |
| 🇮🇳 | **Hindi** | हिन्दी | `hi` | LTR | `http://localhost:3000/#/hi/mileage` |

---

## 🔍 Separate Search Engine Indexability (121 Unique URLs)

Every single page and language is **individually crawlable and indexable** by Google, Bing, Yandex, and Baidu:

1. **Unique URLs**: Structured as `/#/<lang>/<tool-page>` and `/<lang>/<tool-page>` (11 languages × 11 tools = **121 unique crawlable URLs**).
2. **Automated `hreflang` Injection**: The app dynamically injects 11 `<link rel="alternate" hreflang="..." />` tags plus `x-default` fallback into the document `<head>`.
3. **Dynamic Canonical Links**: `<link rel="canonical" href="..." />` dynamically targets the exact language and page combination.
4. **Localized Metadata**: `<title>` and `<meta name="description">` automatically refresh with localized keywords.
5. **Bidirectional Text Support**: Automatically applies `dir="rtl"` to `<html>` for Arabic and `dir="ltr"` for Latin/Cyrillic/Asian scripts.
6. **Built-in Language Directory / Sitemap**: Dedicated tab at `/#/en/sitemap` displays a visual crawlable matrix linking all 121 language/tool permutations.

---

## 🛠️ Complete Tool Suite (11 Core Tools)

| Tool Name | Route ID | Primary Capabilities |
| :--- | :--- | :--- |
| **1. Driving Route & Road Mileage** | `route` | GPS road routing, multi-stop waypoints, round-trip toggle, live fuel cost, OSRM turn-by-turn polyline. |
| **2. Interactive Map Measure Tool** | `measure` | Google Maps style click-to-measure tool: straight-line air distance, feet, meters, walking, running, and road factors. |
| **3. Gas Mileage & Odometer Calculator** | `mileage` | Full-tank method, current vs. previous odometer readings, trip meter, US MPG, UK Imperial MPG, L/100km, km/L (KMPL), cost per mile. |
| **4. Road Trip Cost Splitter** | `trip` | Vehicle presets (Sedan, SUV, Truck, Hybrid, EV), toll fees, parking, lodging, food expenses, multi-passenger split sharing. |
| **5. IRS Mileage Reimbursement (2019–2026)** | `irs` | Complete historical IRS rates archive (2026 $0.70, 2025 $0.685, 2024 $0.67, 2023 $0.655, 2022 $0.625 & $0.585 split rates, 2021 $0.56, 2020 $0.575), Schedule C tax write-offs, CSV export. |
| **6. IFTA State Mileage & Trucking** | `ifta` | Commercial interstate carrier log: state-by-state mileage breakdown, fuel gallons purchased per jurisdiction, net IFTA quarterly tax due or credit. |
| **7. Car Lease & PCP Excess Mileage** | `lease` | Personal Contract Purchase (PCP) & contract hire mileage allowance tracker, pace buffer, projected maturity overage penalty bill, recommended daily/monthly pace. |
| **8. Air Miles & Flight Distance** | `air` | Great-Circle orthodromic airport-to-airport flight distance, nautical miles (NM), flight duration, frequent flyer loyalty miles (Lufthansa Miles & More / Delta / United). |
| **9. EV vs. Gas Savings & Eco Offset** | `ev` | Electric vehicle kWh/100mi & electricity cost vs gas car MPG, 1-8 year cumulative savings, annual CO₂ emissions reduction in lbs and kg. |
| **10. Mileage & Fuel Economy Converter** | `convert` | Miles ↔ Km ↔ NM ↔ Ft, US MPG ↔ UK MPG ↔ L/100km ↔ KMPL, $/mile ↔ $/km, 50:1 two-stroke gas/oil mixing ratio. |
| **11. Searchable FAQs & Knowledge Base** | `faqs` | In-depth answers answering over 50+ long-tail mileage, tax, driving distance, and fuel economy queries with instant live filtering. |

---

## 💻 Localhost Development & Usage

```bash
# 1. Install dependencies
npm install

# 2. Start live Vite development server
npm run dev -- --port 3000

# 3. Open in your browser
# http://localhost:3000
```
