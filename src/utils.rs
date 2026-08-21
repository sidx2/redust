use std::{collections::hash_map::Entry, string::ParseError};

use tokio::time::Duration;

use crate::Map;

pub enum Command {
    Set {
        key: String,
        value: String,
        ttl: Option<Duration>,
    },
    Get {
        key: String,
    },
    Del {
        key: String,
    },
    Exists {
        key: String,
    },
    Expire {
        key: String,
        seconds: u64,
    },
}

pub fn parse(tokens: &[&str]) -> Result<Command, ParseError> {
    match tokens {
        ["set", key, value] => {
            Ok(Command::Set {
                key: key.to_string(),
                value: value.to_string(),
                ttl: None,
            })
        }

        ["set", key, value, ttl] => {
            let ttl = ttl.parse::<u64>()?;

            Ok(Command::Set {
                key: key.to_string(),
                value: value.to_string(),
                ttl: Some(Duration::from_secs(ttl)),
            })
        }

        ["get", key] => {
            Ok(Command::Get {
                key: key.to_string(),
            })
        }

        _ => Err(ParseError::InvalidCommand),
    }
}

pub fn execute(command: Command, store: &mut Map) -> Response {
    match command {
        Command::Set {
            key,
            value,
            ttl,
        } => {
            store.entries.insert(
                key,
                Entry {
                    value,
                    ttl: expires_at.map(
                        |duration| Instant::now() + duration
                    ),
                },
            );

            Response::Ok
        }

        Command::Get { key } => {
            // ...
        }

        Command::Del { key } => {
            // ...
        }
    }
}