use axum::{
    extract::{Json, rejection::JsonRejection, Path},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension,
    Router
};
use sqlx::SqlitePool;
use serde::{Deserialize, Serialize};

use crate::api::error;

#[derive(Serialize, Deserialize, sqlx::FromRow, sqlx::Decode)]
pub struct Ticket {
    id: i64,
    title: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/tickets/:id", get(get_tickets))
        .route("/tickets", post(post_tickets))
}

async fn get_tickets(pool: Extension<SqlitePool>, Path(id): Path<i64>) -> impl IntoResponse {
    let result = sqlx::query_as!(Ticket, "SELECT * FROM tickets WHERE id = $1", id)
        .fetch_one(&*pool)
        .await;
    match result {
        Ok(ticket) => Json(ticket).into_response(),
        Err(e) => error::to_uniform_response(StatusCode::NOT_FOUND, e.to_string()).into_response(),
    }
}

async fn post_tickets(
    pool: Extension<SqlitePool>,
    payload: Result<Json<Ticket>, JsonRejection>,
) -> impl IntoResponse {
    match payload {
        Ok(ticket) => {
            println!("Ticket({}): '{}'", ticket.id, ticket.title);
            let result = sqlx::query!("INSERT INTO tickets (title) VALUES ($1)", ticket.title)
                .execute(&*pool)
                .await;
            match result {
                Ok(r) => Json(Ticket {
                    id: r.last_insert_rowid(),
                    title: String::from(ticket.title.as_str()),
                })
                .into_response(),
                Err(e) => error::to_uniform_response(StatusCode::BAD_REQUEST, e.to_string()).into_response(),
            }        
        },
        Err(e) => error::to_uniform_response(StatusCode::UNPROCESSABLE_ENTITY, e.to_string()).into_response(),
    }
}
