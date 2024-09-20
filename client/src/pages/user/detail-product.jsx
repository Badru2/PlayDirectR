import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { detailProduct } from "../../store/productSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { addToCart } from "../../store/cartSlice";
import { useAuth } from "../../hooks/useAuth";

// Import Swiper styles
import "swiper/css";
import ProductGrid from "../../components/products/ProductGrid";
import axios from "axios";

const DetailProduct = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const productId = new URLSearchParams(search).get("productId");
  const product = useSelector((state) => state.products.productDetail); // Access product detail from Redux
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide

  useEffect(() => {
    if (productId) {
      dispatch(detailProduct(productId));
    }
  }, [dispatch, productId]);

  // Fetch related products based on category
  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(
        `/api/product/related?category=${category}`
      );

      // except the current product
      const filteredProducts = response.data.products.filter(
        (product) => product.id !== Number(productId)
      );

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.log("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (product && product.category) {
      fetchRelatedProducts(product.category); // Only fetch related products when category is available
      setLoading(false);
    }
  }, [product]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const formData = {
      user_id: user.id,
      product_id: Number(productId),
      quantity: quantity,
    };

    try {
      const resultAction = await dispatch(addToCart(formData));
      setQuantity(1); // Reset quantity to 1 after successful add
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  const images = product?.images || [];

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="flex max-w-[1440px] mx-auto mt-4 gap-2 p-4">
            <div className="w-[400px]">
              <div className="sticky top-16 bg-white shadow-md py-3">
                <div className="relative w-full">
                  <div className="carousel w-full">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`carousel-item inset-0 w-full sticky transition-opacity duration-500 ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <img
                          src={`/public/images/products/${image}`}
                          alt={product.name}
                          className="w-full object-contain max-h-80"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex w-full justify-center gap-2 py-2 bottom-0 sticky flex-wrap overflow-y-auto max-h-[153px]">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={`/public/images/products/${image}`}
                        alt={product.name}
                        className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                          index === currentSlide
                            ? "border-2 border-blue-500"
                            : "border-2 border-transparent"
                        }`}
                        onClick={() => handleSlideChange(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <div className="bg-white p-4 space-y-3 shadow-md">
                <div className="font-bold text-2xl">{product.name}</div>
                <div className="font-bold text-3xl">
                  {showFormatRupiah(product.price)}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              </div>
            </div>

            <div className="w-1/4">
              <div className="p-4 space-y-3 bg-white shadow-md sticky top-16">
                {images[0] && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={"/public/images/products/" + images[0]}
                      alt={product.name}
                      className="w-[50px] h-[50px] object-cover rounded-md"
                    />
                    <div className="w-[200px]">{product.name}</div>
                  </div>
                )}

                <div className="border-t border-gray-300 py-3">
                  <form onSubmit={handleAddToCart} className="space-y-5">
                    <div className="flex space-x-3">
                      <div className="flex">
                        <div
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                          className="border h-8 w-8 border-black flex items-center justify-center font-bold rounded-sm cursor-pointer"
                        >
                          -
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={quantity}
                          className="w-12 h-8 border border-black text-center"
                        />
                        <div
                          onClick={() =>
                            quantity < product.quantity &&
                            setQuantity(quantity + 1)
                          }
                          className="border h-8 w-8 border-black flex items-center justify-center font-bold rounded-sm cursor-pointer"
                        >
                          +
                        </div>
                      </div>
                      <div className="self-center">
                        Stock: {product.quantity}
                      </div>
                    </div>
                    <button
                      disabled={product.quantity <= 0}
                      type="submit"
                      className={
                        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm w-full " +
                        (product.quantity <= 0
                          ? "cursor-not-allowed opacity-50"
                          : "")
                      }
                    >
                      Add To Cart
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full py-5">
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
