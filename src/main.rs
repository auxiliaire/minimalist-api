use anyhow::Context;
use axum::{
    extract::{Json, Path},
    http::{header, HeaderValue, StatusCode},
    response::{self, IntoResponse},
    routing::{get, post},
    Extension, Router,
};
use mime;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

#[derive(Serialize, Deserialize, sqlx::FromRow, sqlx::Decode)]
struct Ticket {
    id: i64,
    title: String,
}

#[derive(Serialize)]
struct JsonError {
    code: String,
    message: String,
}

async fn get_tickets(pool: Extension<SqlitePool>, Path(id): Path<i64>) -> impl IntoResponse {
    let result = sqlx::query_as!(Ticket, "SELECT * FROM tickets WHERE id = $1", id)
        .fetch_one(&*pool)
        .await;
    match result {
        Ok(ticket) => Json(ticket).into_response(),
        Err(e) => (
            StatusCode::NOT_FOUND,
            [(
                header::CONTENT_TYPE,
                HeaderValue::from_static(mime::APPLICATION_JSON.as_ref()),
            )],
            json!(JsonError {
                code: StatusCode::NOT_FOUND.to_string(),
                message: e.to_string(),
            })
            .to_string(),
        )
            .into_response(),
    }
}

async fn post_tickets(Json(ticket): Json<Ticket>) -> response::Json<Ticket> {
    println!("Ticket({}): '{}'", ticket.id, ticket.title);
    response::Json(Ticket {
        id: ticket.id,
        title: String::from(ticket.title.as_str()),
    })
}

#[tokio::main]
async fn main() {
    let database_url = dotenvy::var("DATABASE_URL")
        // The error from `var()` doesn't mention the environment variable.
        .context("DATABASE_URL must be set")
        .unwrap();
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .unwrap();
    let app = Router::new()
        .route("/tickets/:id", get(get_tickets))
        .route("/tickets", post(post_tickets))
        .layer(Extension(pool));
    axum::Server::bind(&"0.0.0.0:8000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
