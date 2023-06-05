# Minimalist API

## A fullstack application example in the Rust ecosystem

![Rust Security Audit](https://github.com/auxiliaire/minimalist-api/actions/workflows/audit.yml/badge.svg)
![Rust Build](https://github.com/auxiliaire/minimalist-api/actions/workflows/general.yml/badge.svg)
![JavaScript Build](https://github.com/auxiliaire/minimalist-api/actions/workflows/npm.yml/badge.svg)

This is an integrated Rust backend and Solid JS frontend example.

## Requirements

* Rust nighlty
* Node.js LTS

## Tech Stack

### Infrastructure

* SQLite
* Rust
* Node.js

### Backend

* Axum
* Tokio
* SQLx
* Serde

### Frontend

* Vite
* Tailwind CSS
* daisyUI
* Solid JS

## Starting

```
rustup override set nightly
touch dev.sqlite
cd frontend
npm update
npm run dev
```