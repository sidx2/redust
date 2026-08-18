use std::{
    env::args,
    io::{Write, stdin, stdout},
};

use tokio::io::AsyncBufReadExt;
use tokio::io::AsyncWriteExt;

#[tokio::main]
async fn main() -> () {
    let args: Vec<String> = args().collect();
    if args.len() < 3 {
        eprintln!("usage: $./redust_cli <host> <port>");
        ()
    }
    let [_file_path, host, port] = args.try_into().expect("filed to exact host and port");
    let conn = tokio::net::TcpStream::connect(format!("{host}:{port}"))
        .await
        .expect("Failed to connect to {host}:{port}");

    let (reader, mut writer) = conn.into_split();
    let mut reader = tokio::io::BufReader::new(reader);

    loop {
        print!("> ");
        stdout().flush().expect("Could not flush. LoL!:)");
        let mut command: String = String::new();

        stdin().read_line(&mut command).unwrap();

        if let Err(err) = writer.write_all(command.to_string().as_bytes()).await {
            eprintln!("{err}");
        }

        let mut response = String::new();

        match reader.read_line(&mut response).await {
            Ok(0) => {
                eprintln!("Server closed connection");
                break;
            },
            Ok(_) => {
                print!("{response}");
            },
            Err(err) => { eprintln!("{err}"); }
        }
    }
}
