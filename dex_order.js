// DEX Order Placement
async function placeOrder(type, base, quote, amount, price) {
    console.log(`${type} ${amount} ${base} @ ${price} ${quote}`);
    return { type, base, quote, amount, price };
}
