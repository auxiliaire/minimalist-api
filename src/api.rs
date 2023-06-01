use anyhow::Context;
use axum::{Extension, Router};
use sqlx::SqlitePool;

pub mod tickets;
pub mod error;

pub async fn serve(db: SqlitePool) -> anyhow::Result<()> {
    axum::Server::bind(&"0.0.0.0:8000".parse().unwrap())
        .serve(router(db).into_make_service())
        .await
        .context("failed to serve API")
}

pub fn router(db: SqlitePool) -> Router {
    Router::new()
        .merge(tickets::router())
        .layer(Extension(db))
}
