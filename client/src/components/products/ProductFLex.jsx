import { useState } from "react";
import { Link } from "react-router-dom";
import { showFormatRupiah } from "../../components/themes/format-rupiah";

const ProductFlex = ({ products, handleAddToCart, carts, user }) => {
  const [hoveredProductId, setHoveredProductId] = useState(null);

  return (
    <div className="flex flex-shrink-0 w-full overflow-auto scroll-m-0 py-3 pb-11 space-x-3">
      {products.map((product) => {
        const isHovered = hoveredProductId === product.id;

        return (
          <div
            key={product.id}
            className="bg-white shadow-md hover:transition-transform hover:shadow-2xl hover:z-10 duration-300 relative z-10 rounded-t-md flex-shrink-0 w-52"
            onMouseEnter={() => setHoveredProductId(product.id)}
            onMouseLeave={() => setHoveredProductId(null)}
          >
            <Link to={`/detail?name=${product.name}&productId=${product.id}`}>
              <img
                src={"/public/images/products/" + product.images[0]}
                alt={product.name}
                className="h-48 sm:h-60 md:h-72 lg:h-56 object-cover w-full object-top rounded-t-md"
              />
            </Link>
            <div className="p-2 space-y-3">
              <div className="text-lg font-bold h-12">
                <Link
                  to={`/detail?name=${product.name}&productId=${product.id}`}
                  className="text-black hover:text-black"
                >
                  {product.name}
                </Link>
              </div>
              <div className="font-bold">{showFormatRupiah(product.price)}</div>
            </div>

            <button
              disabled={product.quantity <= 0}
              className={
                "w-full bg-blue-600 text-white text-center py-2 rounded-b-md rounded-none absolute z-10 " +
                // (isHovered ? "block " : "hidden ") +
                (product.quantity <= 0 ? "opacity-50 cursor-not-allowed " : "")
              }
              onClick={(e) =>
                handleAddToCart(e, { productId: product.id, quantity: 1 })
              }
            >
              Add To Cart
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProductFlex;
