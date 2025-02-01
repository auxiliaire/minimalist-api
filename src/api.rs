use anyhow::Context;
use axum::{Extension, Router};
use http::Method;
use sqlx::SqlitePool;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};

pub mod error;
pub mod tickets;

pub async fn serve(db: SqlitePool) -> anyhow::Result<()> {
    let listener = TcpListener::bind("0.0.0.0:8000")
        .await
        .context("failed to bind listener");
    axum::serve(listener.unwrap(), router(db))
        .await
        .context("failed to serve API")
}

pub fn router(db: SqlitePool) -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);

    Router::new()
        .merge(tickets::router())
        .layer(Extension(db))
        .layer(cors)
}
