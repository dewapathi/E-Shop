import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { product } from "@/utilis/product";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type CartContextType = {
    cartTotalQty: number;
    cartTotalAmount: number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQtyIncrease: (product: CartProductType) => void;
    handleCartQtyDecrese: (product: CartProductType) => void;
    handleClearCart: () => void;
    paymentIntent: string | null;
    handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);
interface Props {
    [propName: string]: any;
};

export const CartContextProvider = (props: Props) => {
    const [cartTotalAmount, setTotalAmount] = useState(0);
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

    useEffect(() => {
        const cartItems: any = localStorage.getItem('eShopCartItems');
        const cProducts: CartProductType[] | null = JSON.parse(cartItems);
        const eShopPaymentIntent: any = localStorage.getItem('eShopPaymentIntent');
        const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

        setCartProducts(cProducts);
        setPaymentIntent(paymentIntent);
    }, []);

    useEffect(() => {
        const getTotals = () => {
            if (cartProducts) {
                const { total, qty } = cartProducts?.reduce((acc, item) => {
                    // console.log('acc', acc, "item", item);
                    const itemTotal = item.price * item.quantity;
                    // console.log('itemTotal', itemTotal);
                    acc.total += itemTotal;
                    acc.qty += item.quantity;

                    return acc;
                }, {
                    total: 0,
                    qty: 0,
                });

                setCartTotalQty(qty);
                setTotalAmount(total);
            }
        }
        getTotals();
    }, [cartProducts]);

    const handleAddProductToCart = useCallback((product: CartProductType) => {
        setCartProducts((prev) => {
            let updateCart;

            if (prev) {
                updateCart = [...prev, product]
            } else {
                updateCart = [product]
            }

            toast.success('Product added to cart');
            localStorage.setItem('eShopCartItems', JSON.stringify(updateCart));
            return updateCart;
        })
    }, []);

    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
        // console.log('product', product);

        if (cartProducts) {
            const filteredProducts = cartProducts.filter((item) => {
                // console.log('item.id', item.id);
                // console.log('product.id', product.id);
                return item.id !== product.id
            });
            // console.log('filteredProducts', filteredProducts);

            setCartProducts(filteredProducts);
            toast.success("Product removed");
            localStorage.setItem("eShopCartItems", JSON.stringify(filteredProducts))
        }
    }, [cartProducts]);

    const handleCartQtyIncrease = useCallback((product: CartProductType) => {
        let updateCart;

        if (product.quantity === 99) {
            return toast.error("Ooops! Maximum reached");
        }

        if (cartProducts) {
            updateCart = [...cartProducts];
            const existingIndex = updateCart.findIndex((item) => item.id === product.id);

            if (existingIndex > -1) {
                updateCart[existingIndex].quantity++;
                setCartProducts(updateCart);
                localStorage.setItem("eShopCartItems", JSON.stringify(updateCart));
            }
        }

    }, [cartProducts]);

    const handleCartQtyDecrese = useCallback((product: CartProductType) => {
        let updateCart;

        if (product.quantity === 1) {
            return toast.error("Ooops! Minimum reached");
        }

        if (cartProducts) {
            updateCart = [...cartProducts];
            const existingIndex = updateCart.findIndex((item) => item.id === product.id);
            // console.log('existingIndex', existingIndex);

            if (existingIndex > -1) {
                updateCart[existingIndex].quantity--;
                setCartProducts(updateCart);
                localStorage.setItem("eShopCartItems", JSON.stringify(updateCart));
            }
        }
    }, [cartProducts]);

    const handleClearCart = useCallback(() => {
        setCartProducts(null);
        setCartTotalQty(0);
        localStorage.setItem("eShopCartItems", JSON.stringify(null));
    }, []);

    const handleSetPaymentIntent = useCallback((val: string | null) => {
        setPaymentIntent(val);
        localStorage.setItem('eShopPaymentIntent', JSON.stringify(val));
    }, [paymentIntent]);

    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrese,
        handleClearCart,
        paymentIntent,
        handleSetPaymentIntent,
    }

    return <CartContext.Provider value={value} {...props} />
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart must be used within a CartContextProvider");
    }

    return context;
};