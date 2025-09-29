document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. CONFIGURAÇÃO E VARIÁVEIS GLOBAIS
    // =========================================================

    const products = [
        { id: 1, name: "Mix de Vegetais Orgânicos", price: 29.90, image: "https://media.istockphoto.com/id/1152758583/pt/foto/assortment-of-fresh-fruits-and-vegetables.webp?a=1&b=1&s=612x612&w=0&k=20&c=LboReEgJ0a3HynMpFKVXYY3HkQJqBuBvOvxlTiDSUrA=" },
        { id: 2, name: "Cesta de Frutas da Estação", price: 35.50, image: "https://media.istockphoto.com/id/1141730914/pt/foto/healthy-food-fresh-organic-fruits-and-vegetables-in-an-old-box.webp?a=1&b=1&s=612x612&w=0&k=20&c=ICM4fsuMoqc0HyAlm275uZcavkDQdvxtg6eblvRWi6k=" },
        { id: 3, name: "Azeite Orgânico Extra Virgem", price: 49.90, image: "https://media.istockphoto.com/id/1206682746/pt/foto/pouring-extra-virgin-olive-oil-in-a-glass-bowl.webp?a=1&b=1&s=612x612&w=0&k=20&c=-XqNh1AvA-I5MF47VVkoPiTjLugps9e3KoomMHUReuw=" },
        { id: 4, name: "Ovos Orgânicos galinha Caipiras", price: 18.00, image: "https://media.istockphoto.com/id/1322511698/pt/foto/chicken-with-freshly-laid-eggs.webp?a=1&b=1&s=612x612&w=0&k=20&c=RBgLSWXnE6zjX5Av8GUBxymzite-19e1Qe1Z4GTUenA=" }
    ];

    // URL do Formspree para o envio AJAX da Newsletter (COLOQUE SUA URL AQUI!)
    const FORMSPREE_NEWSLETTER_URL = 'https://formspree.io/f/xvgwkgbe'; 

    let cart = []; // Estado global do carrinho

    // =========================================================
    // 2. SELETORES DO DOM
    // =========================================================

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const productsContainer = document.getElementById('produtos').querySelector('.products-container');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');


    // =========================================================
    // 3. FUNÇÕES DE UTILIDADE E AUXILIARES
    // =========================================================

    // Função para abrir e fechar o carrinho
    function toggleCart() {
        cartSidebar.classList.toggle('open');
    }

    // Função para renderizar o feedback da newsletter
    function showNewsletterFeedback(message, isSuccess = true) {
        let feedbackElement = document.getElementById('newsletter-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('p');
            feedbackElement.id = 'newsletter-feedback';
            feedbackElement.style.marginTop = '15px';
            feedbackElement.style.fontWeight = 'bold';
            
            if (newsletterForm) {
                newsletterForm.after(feedbackElement);
            } else {
                return;
            }
        }
        feedbackElement.textContent = message;
        // Assume que as variáveis CSS estão disponíveis globalmente (correto)
        feedbackElement.style.color = isSuccess ? '#4CAF50' : '#ff6347'; 
        
        setTimeout(() => {
            feedbackElement.textContent = '';
        }, 4000);
    }

    // FUNÇÕES DO CARRINHO
    function updateCartUI() {
        // ... (o código da updateCartUI é longo, mas está correto) ...
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalCount = 0;

        if (cart.length === 0) {
             cartItemsContainer.innerHTML = '<p style="text-align: center; color: #777;">Seu carrinho está vazio.</p>';
        } else {
             cart.forEach(item => {
                 const itemElement = document.createElement('div');
                 itemElement.classList.add('cart-item');
                 itemElement.innerHTML = `
                     <img src="${item.image}" alt="${item.name}">
                     <div class="item-info">
                         <h4>${item.name}</h4>
                         <p>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                         <div class="item-quantity">
                             <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                             <span class="quantity">${item.quantity}</span>
                             <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                         </div>
                     </div>
                     <button class="remove-item-btn" data-id="${item.id}">
                         <i class="fas fa-trash-alt"></i>
                     </button>
                 `;
                 cartItemsContainer.appendChild(itemElement);
                 total += item.price * item.quantity;
                 totalCount += item.quantity;
             });
        }
        
        cartCountSpan.textContent = totalCount;
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
    }
    
    function increaseQuantity(productId) {
        const item = cart.find(i => i.id === parseInt(productId));
        if (item) {
            item.quantity++;
            updateCartUI();
        }
    }

    function decreaseQuantity(productId) {
        const item = cart.find(i => i.id === parseInt(productId));
        if (item && item.quantity > 1) {
            item.quantity--;
            updateCartUI();
        } else if (item && item.quantity === 1) {
            removeItem(productId);
        }
    }

    function addItem(productId) {
        const existingItem = cart.find(item => item.id === parseInt(productId));
        if (existingItem) {
            existingItem.quantity++;
        } else {
            const productToAdd = products.find(p => p.id === parseInt(productId));
            if (productToAdd) {
                cart.push({ ...productToAdd, quantity: 1 });
            }
        }
        updateCartUI();
    }

    function removeItem(productId) {
        cart = cart.filter(item => item.id !== parseInt(productId));
        updateCartUI();
    }
    
    function renderProducts() {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Funções de Checkout
    function handleCheckout() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio! Adicione alguns produtos antes de finalizar a compra.');
            return;
        }

        let total = 0;
        let message = "Olá! Gostaria de fazer o seguinte pedido de produtos orgânicos:\n\n";
        
        cart.forEach(item => {
            message += ` - ${item.name} | Qtd: ${item.quantity} | Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
            total += item.price * item.quantity;
        });

        const totalFormatted = total.toFixed(2).replace('.', ',');
        message += `\nTotal Geral: R$ ${totalFormatted}`;
        message += "\n\nPor favor, aguardo a confirmação da disponibilidade e opções de frete.";

        const phoneNumber = "+5519983279515"; 
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappLink, '_blank');
        
        cart = [];
        updateCartUI();
        toggleCart();

        alert("Seu pedido foi montado! Verifique a nova aba ou permita o pop-up para falar conosco no WhatsApp.");
    }


    // =========================================================
    // 4. LISTENERS DE EVENTOS
    // =========================================================
    
    // Inicialização da página
    renderProducts();
    updateCartUI();

    // Carrinho e Navegação
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', handleCheckout); 
    continueShoppingBtn.addEventListener('click', toggleCart);

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

    // Adicionar ao Carrinho
    productsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.id;
            addItem(productId);
        }
    });

    // Manipulação de Itens no Carrinho
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        let productId;

        const removeBtn = target.closest('.remove-item-btn');
        if (removeBtn) { 
            productId = removeBtn.dataset.id;
            removeItem(productId);
            return; 
        } 
        
        const increaseBtn = target.closest('.increase-btn');
        if (increaseBtn) {
            productId = increaseBtn.dataset.id;
            increaseQuantity(productId);
            return;
        } 
        
        const decreaseBtn = target.closest('.decrease-btn');
        if (decreaseBtn) {
            productId = decreaseBtn.dataset.id;
            decreaseQuantity(productId);
            return;
        }
    });
    
    // Newsletter (Formspree AJAX - SILENCIOSA)
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value;
            
            if (!email) {
                showNewsletterFeedback('Por favor, digite um email válido.', false);
                return;
            }

            const formData = new FormData(newsletterForm);

            showNewsletterFeedback('Enviando sua inscrição...', false);

            try {
                const response = await fetch(FORMSPREE_NEWSLETTER_URL, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' 
                    }
                });

                if (response.ok) {
                    showNewsletterFeedback('Inscrição realizada com sucesso! Você receberá as ofertas!', true);
                    newsletterForm.reset();
                } else {
                    const data = await response.json();
                    showNewsletterFeedback(data.error || 'Falha ao se inscrever. Tente novamente.', false);
                }
            } catch (error) {
                showNewsletterFeedback('Erro de rede. Verifique sua conexão.', false);
                console.error('Newsletter Fetch Error:', error);
            }
        });
    }

});