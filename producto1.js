const cartIcon = document.querySelector('.cart-icon');
        const cartModal = document.querySelector('.cart-modal');
        const addToCartButton = document.querySelector('.add-to-cart');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        cartIcon.addEventListener('click', () => {
            cartModal.classList.toggle('active');
            updateCartDisplay();
        });

        addToCartButton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            addToCart(id, name, price);
            updateCartDisplay();
            cartModal.classList.add('active');
        });

        function addToCart(id, name, price) {
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
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

        // Initialize cart display
        updateCartDisplay();