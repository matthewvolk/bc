# `bc`

A suite of tools for BigCommerce store administration.

## Requirements

- **Node.js:** `>= 18`

## Getting Started

Clone this repository

```bash
git clone git@github.com:matthewvolk/bc.git && cd bc
```

Copy and populate a `.env.local` file

```bash
cp .env.example .env.local
```

Install dependencies

```bash
pnpm install
```

Scaffold the database

```bash
pnpm db:push
```

Run the development server

```bash
pnpm dev
```
