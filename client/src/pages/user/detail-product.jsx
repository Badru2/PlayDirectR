import React, { useEffect, useRef, useState } from "react";
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

import Toast from "../../components/themes/alert";
import { Helmet } from "react-helmet";
import ProductFlex from "../../components/products/ProductFLex";

const DetailProduct = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const productId = new URLSearchParams(search).get("productId");
  const product = useSelector((state) => state.products.productDetail); // Access product detail from Redux
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide
  const toTop = useRef(null);

  useEffect(() => {
    if (productId) {
      setLoading(true); // Set loading to true before fetching product
      dispatch(detailProduct(productId)).finally(() => {
        setLoading(false); // Set loading to false after product is fetched
        toTop.current.scrollIntoView();
      });
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

      Toast.fire({
        icon: "success",
        title: "Added to Cart",
      });
    } catch (error) {
      console.log("Error adding to cart:", error);

      Toast.fire({
        icon: "error",
        title: "Failed to add to cart",
      });
    }
  };

  const images = product?.images || [];

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <Helmet>
        <title>{product?.name}</title>
      </Helmet>

      <div ref={toTop} className="top-0 absolute z-[-10]" />
      {loading ? (
        <div className="flex flex-col lg:flex-row w-full lg:max-w-[1440px] mx-auto mt-4 gap-2 p-4">
          <div className="w-full lg:w-[400px] bg-gray-400 animate-pulse h-96">
            <div className="w-full h-[300px] bg-gray-500 animate-pulse" />
            <div className="flex justify-center items-center space-x-3 h-[80px]">
              <div className="w-[60px] h-[60px] bg-gray-500 animate-pulse" />
              <div className="w-[60px] h-[60px] bg-gray-500 animate-pulse" />
              <div className="w-[60px] h-[60px] bg-gray-500 animate-pulse" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-gray-400 animate-pulse p-4 space-y-7">
            <div className="space-y-4">
              <div className="w-3/5 h-5 bg-gray-500 animate-pulse rounded-full" />
              <div className="w-1/3 h-6 bg-gray-500 animate-pulse rounded-full" />
            </div>

            <div>
              {[...Array(17)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse h-4 rounded-full my-3 bg-gray-500 ${
                    (i + 1) % 5 === 0 ? "w-3/4 mb-8" : "w-full"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-1/4 hidden lg:block">
            <div className="w-full h-[235px] bg-gray-400 animate-pulse p-4 space-y-3">
              <div className="flex space-x-3">
                <div className="w-14 h-14 bg-gray-500 animate-pulse" />

                <div className="w-3/4 space-y-2">
                  <div className="w-full h-4 bg-gray-500 animate-pulse rounded-full" />
                  <div className="w-1/2 h-4 bg-gray-500 animate-pulse rounded-full" />
                </div>
              </div>

              <div className="w-full h-2 bg-gray-500 animate-pulse rounded-full" />

              <div className="flex">
                <div className="w-10 h-10 bg-gray-500 animate-pulse border-gray-600 border-2" />
                <div className="w-14 h-10 bg-gray-500 animate-pulse border-gray-600 border-2" />
                <div className="w-10 h-10 bg-gray-500 animate-pulse border-gray-600 border-2" />
              </div>

              <div className="w-full bg-gray-500 animate-pulse h-14" />
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-12">
          <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto mt-4 gap-2 p-4 lg:pb-4 lg:px-0">
            <div className="w-full lg:w-[400px]">
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

            <div className="w-full lg:w-1/2">
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

            <div className="w-1/4 hidden lg:block">
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

          <div className="lg:hidden fixed bottom-0 w-full flex z-30 bg-white py-1 border-t border-gray-400 justify-between px-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-gray-400 rounded-md text-2xl flex justify-center items-center">
                <span className="icon-[token--chat]"></span>
              </div>

              <div className="text-xl">
                Stock : <b>{product.quantity}</b>
              </div>
            </div>

            <button
              disabled={product.quantity <= 0}
              onClick={(e) =>
                handleAddToCart(e, {
                  productId: product.id,
                  quantity: 1,
                })
              }
              type="submit"
              className={
                "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm w-1/2 " +
                (product.quantity <= 0 ? "cursor-not-allowed opacity-50" : "")
              }
            >
              Add To Cart
            </button>
          </div>

          <div className="w-full p-4 lg:p-0 space-y-3">
            <div className="font-bold text-2xl">Related Product :</div>
            {/* <ProductGrid
              products={relatedProducts}
              handleAddToCart={handleAddToCart}
            /> */}
            <ProductFlex
              products={relatedProducts}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
