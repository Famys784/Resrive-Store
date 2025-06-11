// Get the total price from the cart
const totalPrice = localStorage.getItem('totalPrice');

// Display the total price in the payment form
document.getElementById('total-price').innerText = `Total: $${totalPrice}`;

// Create a Stripe Element
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Add event listener to submit button
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    const { token } = await stripe.createToken(cardElement);
    if (token) {
        // Send token to server to charge customer
        fetch('http://localhost:3000/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token.id, amount: totalPrice }),
        })
    .then((response) => response.json())
    .then((data) => {
            // Update payment status
            document.getElementById('payment-status').innerText = 'Payment successful!';
        })
    .catch((error) => {
            // Update payment status
            document.getElementById('payment-status').innerText = 'Payment failed!';
        });
    }
});