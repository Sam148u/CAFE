const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');

let cart = [];

cartIcon.addEventListener('click', () => {
    cartModal.classList.toggle('active');
});

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        
        addToCart(id, name, price);
        updateCartDisplay();
    });
});

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-id="${item.id}">Eliminar</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = total.toFixed(2);

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
   console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
   appId: process.env.MicrosoftAppId,
   appPassword: process.env.MicrosoftAppPassword
});

const onTurnErrorHandler = async (context, error) => {
   console.error(`\n [onTurnError] unhandled error: ${error}`);
   await context.sendActivity('Oops. Algo salió mal!');
};

adapter.onTurnError = onTurnErrorHandler;

server.post('/api/messages', (req, res) => {
   adapter.processActivity(req, res, async (context) => {
      if (context.activity.type === 'message') {
         await context.sendActivity(`Dijiste: ${context.activity.text}`);
      }
   });
});