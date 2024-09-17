import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { detailProduct } from "../../store/productSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { addToCart } from "../../store/cartSlice";
import { useAuth } from "../../hooks/useAuth";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const DetailProduct = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const productId = new URLSearchParams(search).get("productId");
  const product = useSelector((state) => state.products.products);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    dispatch(detailProduct(productId)).then(() => setLoading(false));
  }, [dispatch, productId]);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent page reload

    const formData = {
      user_id: user.id,
      product_id: Number(productId),
      quantity: quantity,
    };

    try {
      console.log("Adding to cart:", formData);
      const resultAction = await dispatch(addToCart(formData));
      setQuantity(1); // Reset quantity to 1 after successful add
      console.log(resultAction);
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  // Safeguard check for product and images array
  const productData = product?.product || {};
  const images = productData.images || [];

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex max-w-[1440px] mx-auto mt-4 gap-2 p-4">
          <div className="max-w-[400px]">
            <div className="bg-white shadow-md col-span-2 sticky top-20">
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined} // Safeguard
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={"/public/images/products/" + image}
                      alt={productData.name}
                      className="w-[400px] h-[400px] object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="p-3">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={images.length}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="flex justify-center items-center"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={"/public/images/products/" + image}
                        alt={productData.name}
                        className="w-[50px] h-[50px] object-cover cursor-pointer"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <div className="bg-white p-4 space-y-3 shadow-md">
              <div className="font-bold text-2xl">{productData.name}</div>
              <div className="font-bold text-3xl">
                {showFormatRupiah(productData.price)}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: productData.description,
                }}
              />
            </div>
          </div>

          <div className="w-1/4">
            <div className="p-4 space-y-3 bg-white shadow-md sticky top-20">
              {images[0] && (
                <div className="flex items-center space-x-3">
                  <img
                    src={"/public/images/products/" + images[0]}
                    alt={productData.name}
                    className="w-[50px] h-[50px] object-cover rounded-md"
                  />
                  <div className="w-[200px]">{productData.name}</div>
                </div>
              )}

              <div className="border-t border-gray-300 py-3">
                <form onSubmit={handleAddToCart} className="space-y-5">
                  <div className="flex space-x-3">
                    <div className="flex ">
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
                        onChange={(e) => {
                          const value = Math.max(
                            1,
                            Math.min(
                              Number(e.target.value),
                              productData.quantity
                            )
                          ); // Ensure the value stays between 1 and product.stock
                          setQuantity(value);
                        }}
                        className="w-12 h-8 border border-black text-center"
                      />
                      <div
                        onClick={() =>
                          quantity < productData.quantity &&
                          setQuantity(quantity + 1)
                        } // Allow increments
                        className="border h-8 w-8 border-black flex items-center justify-center font-bold rounded-sm cursor-pointer"
                      >
                        +
                      </div>
                    </div>
                    <div className="self-center">
                      Stock: {productData.quantity}
                    </div>
                  </div>
                  <button
                    disabled={productData.quantity == 0}
                    type="submit"
                    className={
                      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm w-full " +
                      (productData.quantity == 0
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
      )}
    </div>
  );
};

export default DetailProduct;
