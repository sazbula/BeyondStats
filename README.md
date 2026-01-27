# BeyondStats

**BeyondStats** is an interactive platform that helps users explore gender inequality across countries and time 
**To run locally** npm run dev
 **Link:** https://beyondstats.netlify.app/

---

## Problem

Gender inequality data is often presented through dozens of disconnected indicators and complex reports.  
This makes it difficult for people to understand patterns, compare countries, or engage meaningfully with the data.

---

## Our Solution

BeyondStats simplifies gender inequality data by:
- Combining multiple gender‑related metrics into a **single, interpretable score**
- Using **machine learning** to estimate recent values where official indices are missing
- Presenting insights through **interactive visuals** instead of raw tables

This allows users to focus on understanding inequality rather than decoding numbers.

---

## Machine Learning Approach

We used a **Random Forest regression model** to predict the Gender Inequality Index (GII).

### Why this matters for users
Without machine learning, users would need to manually compare dozens of indicators to understand inequality.  
Our model reduces this complexity into one clear score, making comparison and exploration far more intuitive.

### How it works
- Trained on **real historical GII values**
- Input features grouped into three categories:
  - **Economic**
  - **Social**
  - **Physical / Health**
- Used to **predict GII values for 2022, 2023, and 2024**, where no official data was available

---

## Data

- **Source:** World Bank Gender Statistics dataset (CSV)


## Key Features

- Interactive world map for country‑level exploration  
- Country insights with historical trends  
- Machine‑learning‑powered inequality score  
- Mini‑games to encourage learning through interaction