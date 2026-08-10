use std::io::{Write, stdin, stdout};

fn main() {
    loop {
        print!("> ");
        stdout().flush().expect("Could not flush. LoL!:)");
        let mut buf = String::new();

        let handle = stdin().read_line(&mut buf);
        match handle {
            Ok(_read_bytes) => {
                print!("you said: {buf}");
            },
            Err(err) => {
                eprintln!("Failed to parse command: {err}");
            }
        }
    }
}