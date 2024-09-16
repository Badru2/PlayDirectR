import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { detailProduct } from "../../store/productSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";

const DetailProduct = () => {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const productId = new URLSearchParams(search).get("productId");
  const product = useSelector((state) => state.products.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(detailProduct(productId)).then(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex max-w-[1440px] mx-auto mt-4 gap-2 p-4">
          <div className="max-w-[400px]">
            <div className="bg-white shadow-md col-span-2 sticky top-20">
              <div className="pt-2">
                <img
                  src={"/public/images/products/" + product.product.images[0]}
                  alt={product.product.name}
                  className="w-[400px] h-[400px] object-contain"
                />
              </div>

              <div className="flex justify-center items-center py-2 space-x-2">
                {product.product.images.map((image, index) => (
                  <img
                    src={"/public/images/products/" + image}
                    alt={product.product.name}
                    className="w-[50px] h-[50px] object-cover rounded-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <div className="bg-white p-4 space-y-3 shadow-md">
              <div className="font-bold text-2xl">{product.product.name}</div>

              <div className="font-bold text-3xl">
                {showFormatRupiah(product.product.price)}
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: product.product.description,
                }}
              />
            </div>
          </div>

          <div className="w-1/4">
            <div className="p-4 space-y-3 bg-white shadow-md sticky top-20">
              <div className="flex items-center space-x-3">
                <img
                  src={"/public/images/products/" + product.product.images[0]}
                  alt={product.product.name}
                  className="w-[50px] h-[50px] object-cover rounded-md"
                />
                <div>{product.product.name}</div>
              </div>
              <div className="flex">
                {/* <div className="w-12"></div> */}
                <div>Stock: {product.product.quantity}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
