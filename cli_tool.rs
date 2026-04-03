use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "mycli")]
#[command(about = "A CLI tool", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Hello {
        #[arg(short, long)]
        name: Option<String>,
    },
}

fn main() {
    let cli = Cli::parse();
    match &cli.command {
        Commands::Hello { name } => {
            let name = name.as_deref().unwrap_or("World");
            println!("Hello, {}!", name);
        }
    }
}
