use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use tokio::io::{AsyncReadExt, AsyncWriteExt};

mod ttl_worker;

#[derive(Clone, Copy)]
struct TTLItem<T> {
    value: T,
    ttl: tokio::time::Instant,
}
struct Map {
    map_string_string: HashMap<Box<str>, Box<str>>,
    map_string_ttl_item: HashMap<Box<str>, Box<TTLItem<String>>>
}

fn parse_command(command: String) -> std::io::Result<Vec<String>> {
    println!("parsing command = {:?}", command);
    let args: Vec<String> = command.split(" ").map(|arg| arg.to_string()).collect();
    // for arg in args.clone() {
    //     println!("arg = {:?}", arg);
    // }

    // if args.len() < 3 {
    //     println!("Invalid command");
    //     return Err(Error::new(ErrorKind::InvalidInput, "Invalid command"));
    // }

    // if args[0] != "set" {
    //     println!("Invalid command");
    //     return Err(Error::new(ErrorKind::InvalidInput, "Invalid command"));
    // }

    return Ok(args);
}

async fn handle_connection(mut tcp_stream: tokio::net::TcpStream, map: Arc<Mutex<Map>>) {
    loop {
        let mut buf: [u8; 1 << 10] = [0; 1 << 10];
        let n = match tcp_stream.read(&mut buf).await {
            Ok(0) => {
                eprintln!("Client closed the connection");
                return;
            },
            Ok(n) => n,
            Err(err) => {
                eprintln!("{err}");
                return;
            }
        };

        println!("read {} bytes ...", n);

        let command = String::from_utf8_lossy(&mut buf[..n]).into_owned();
        let command_parsed = parse_command(command);
        println!("commands_parsed = {:?}", command_parsed);
        match command_parsed {
            Ok(command_vec) => {
                if command_vec[0] == "set" && command_vec.len() == 3 {
                    let key = command_vec[1].clone();
                    let val = command_vec[2].clone();

                    let k = key.trim();
                    let v = val.trim();

                    {
                        let mut map_locked = map.lock().expect("Failed to lock map");

                        map_locked
                            .map_string_string
                            .insert(Box::from(k), Box::from(v));
                    } // MutexGuard dropped here

                    let response = format!("set {k} to {v}");

                    let _ = tcp_stream
                        .write_all(format!("{response}\n").to_string().as_bytes())
                        .await
                        .map_err(|err| {
                            eprintln!("Filed to write to tcpStream: {err}");
                        });
                }

                if command_vec[0] == "set" && command_vec.len() == 4 {
                    let key = command_vec[1].clone();
                    let val = command_vec[2].clone();
                    let ttl: String = command_vec[3].clone();

                    let ttl_u32: u32 = ttl
                        .trim()
                        .parse()
                        .unwrap_or(60 * 60 * 24 * 365);

                    let k = key.trim();
                    let v = val.trim();

                    {
                        let mut map_locked = map.lock().expect("Failed to lock map");
                        let ttl_ = tokio::time::Instant::now() + tokio::time::Duration::from_secs(ttl_u32 as u64);
                        map_locked
                            .map_string_ttl_item
                            .insert(Box::from(k), Box::from(TTLItem {value: String::from(v), ttl: ttl_}));
                        println!("inserted with interval {ttl_:?}");
                    } // MutexGuard dropped here

                    let response = format!("set {k} to {v}");

                    let _ = tcp_stream
                        .write_all(format!("{response}\n").to_string().as_bytes())
                        .await
                        .map_err(|err| {
                            eprintln!("Filed to write to tcpStream: {err}");
                        });
                }

                if command_vec[0] == "get" && command_vec.len() == 2 {
                    let k = command_vec[1].trim();

                    let value = {
                        let map_locked = map.lock().expect("failed to aquire lock on map");
                        match map_locked.map_string_ttl_item.get(k) { // todo, dynamic dispatch
                            Some(value) => value.value.to_string(),
                            None => String::new(),
                        }
                    };
                    let _ = tcp_stream
                        .write_all(format!("{value}\n").to_string().as_bytes())
                        .await
                        .map_err(|err| {
                            eprintln!("Filed to write to tcpStream: {err}");
                        });
                }
            }
            Err(_err) => {}
        }
    }
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let tcp = tokio::net::TcpListener::bind("127.0.0.1:8000");
    let map = Arc::new(Mutex::new(Map {
        map_string_string: HashMap::new(),
        map_string_ttl_item: HashMap::new()
    }));

    let map_clone: Arc<Mutex<Map>> = Arc::clone(&map);

    tokio::spawn(ttl_worker::ttl_worker(map_clone));
    match tcp.await {
        Ok(conn) => loop {
            let (stream, _socket_addr) = conn.accept().await.unwrap();

            let map_clone: Arc<Mutex<Map>> = Arc::clone(&map);

            tokio::spawn(async move {
                handle_connection(stream, map_clone).await;
            });
        },
        Err(err) => {
            println!("Failed to lauch TCP Server: {:?}", err);
        }
    }

    Ok(())
}
