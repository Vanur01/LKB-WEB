import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartSummary {
  totalPrice: string;
  gst: string;
  deliveryCharge: string;
  totalWithExtras: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  isLoading?: boolean;
  cartSummary?: CartSummary;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  isLoading = false,
  cartSummary,
}) => {
  const router = useRouter();

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
    onClose(); // Close the cart sidebar when navigating
  };

  return (
    <>
      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 ">
            <h2 className="text-lg font-semibold text-gray-800">
              My Order ({getTotalItems()} items)
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 border-1 border-dashed border-zinc-400 rounded-lg"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                      unoptimized={true}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-500 font-medium">
                          ₹{item.price}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="text-gray-700 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-1 hover:bg-gray-200 rounded text-red-500"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 pb-5">
              {/* Bill Summary */}
              <div className="space-y-4 mb-4">
                {/* Subtotal Count */}
                <h1 className="font-bold mb-5">Bill Summary</h1>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Subtotal (
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    items )
                  </span>
                  <span>₹{cartSummary ? cartSummary.totalPrice : getTotalPrice()}</span>
                </div>

                {/* Delivery Fee */}
                {/* <div className="flex justify-between text-sm">
                  <span>Delivery Charges</span>
                  <span>₹{cartSummary ? cartSummary.deliveryCharge : '15'}</span>
                </div> */}

                {/* Total */}
                <div className="border-t pt-3 border-zinc-300">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{cartSummary ? cartSummary.totalPrice : getTotalPrice()}</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Custom CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default CartSidebar;
