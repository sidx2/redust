use std::collections::{HashMap};
use std::io::{ Read, Write};
use std::net::TcpStream;
use std::sync::{Arc, Mutex};
use std::{net::TcpListener, };
use std::{ thread};


struct Map {
    map_string_string: HashMap<Box<str>, Box<str>>,
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

fn handle_connection(mut tcp_stream: TcpStream, map: Arc<Mutex<Map>>) {
    let mut buf: [u8; 1<<10] = [0; 1<<10];
    let n = tcp_stream.read(&mut buf).expect("Failed to read");

    println!("read {} bytes ...", n);

    let command = String::from_utf8_lossy(&mut buf[..n]).into_owned();
    let command_parsed = parse_command(command);
    println!("commands_parsed = {:?}", command_parsed);
    match command_parsed {
        Ok(command_vec) => {
            if command_vec[0] == "set" && command_vec.len() == 3 {
                let mut map_locked = map.lock().expect("Failed to lock map");
                let key = command_vec[1].clone();
                let val = command_vec[2].clone();

                let k = key.trim();
                let v = val.trim();
                map_locked.map_string_string.insert(Box::from(k), Box::from(v));

                drop(map_locked);
                let _ = write!(tcp_stream, "set {k} to {v}").map_err(|err| {
                    eprintln!("Filed to write to tcpStream: {err}");
                });
            }

            if command_vec[0] == "get" && command_vec.len() == 2 {
                let map_locked = map.lock().expect("Failed to lock map");
                let k = command_vec[1].clone();
                let kk = k.trim();

                let v = map_locked.map_string_string.get(kk);
                let mut value = String::from("");
                match v {
                    Some(val) => {
                        value = val.to_string();
                    },
                    None => {}
                }
                let _ = write!(tcp_stream, "{value}").map_err(|err| {
                    eprintln!("Filed to write to tcpStream: {err}");
                });
            }
        }, 
        Err(_err) => {}
    }
}

fn main() -> std::io::Result<()> {
    let tcp = TcpListener::bind("127.0.0.1:8000");
    let map = Arc::new(Mutex::new(Map {map_string_string: HashMap::new()}));
    match tcp {
        Ok(conn) => {
            for stream in conn.incoming() {
                match stream {

                    Ok(tcp_stream) => {
                        let map_clone: Arc<Mutex<Map>> = Arc::clone(&map);

                        thread::spawn(move || {
                            handle_connection(tcp_stream, map_clone);
                        });
                    },
                    Err(err) => {
                        println!("Something wrong with tcp connection {:?}", err);
                    }
                }
            }

        },
        Err(err) => {
            println!("Failed to lauch TCP Server: {:?}", err);
        }
    }

    Ok(())
}
