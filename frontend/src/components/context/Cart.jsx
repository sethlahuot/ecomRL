import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [ cartData, setCartData] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    });

    const addToCart = (product, size=null) => {
        try {
            let updatedCart = [...cartData];

            if (size != null) {
                const isProductExist = updatedCart.find(item =>
                    item.product_id === product.id && item.size === size
                );
                if (isProductExist) {
                    updatedCart = updatedCart.map(item => 
                        (item.product_id === product.id && item.size === size)
                        ? {...item, qty: item.qty + 1}
                        : item
                    );
                } else {
                    updatedCart.push({
                        id: `${product.id}-${Math.floor(Math.random() * 100000000)}`,
                        product_id: product.id,
                        size: size,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                        image_url: product.image_url,
                    });
                }
            } else {
                const isProductExist = updatedCart.find(item =>
                    item.product_id === product.id && item.size === null
                );
                if (isProductExist) {
                    updatedCart = updatedCart.map(item => 
                        (item.product_id === product.id && item.size === null)
                        ? {...item, qty: item.qty + 1}
                        : item
                    );
                } else {
                    updatedCart.push({
                        id: `${product.id}-${Math.floor(Math.random() * 100000000)}`,
                        product_id: product.id,
                        size: null,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                        image_url: product.image_url,
                    });
                }
            }
            setCartData(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw new Error('Failed to add item to cart');
        }
    };

    return (
        <CartContext.Provider value={{ cartData, setCartData, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};