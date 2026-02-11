FROM cosmwasm/rust-optimizer:0.12.6

WORKDIR /code
COPY . .

RUN cargo build --release --target wasm32-unknown-unknown
