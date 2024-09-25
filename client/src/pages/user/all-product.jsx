import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showFormatRupiah } from "../../components/themes/format-rupiah";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (currentPage) => {
    try {
      const response = await axios.get("/api/product/all", {
        params: { page: currentPage, limit: 10 },
      });

      // sort by name
      response.data.products.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="pb-24 space-y-4">
      <div className="text-3xl font-bold">All Products:</div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {products.map((product) => {
          const isHovered = hoveredProductId === product.id;

          return (
            <div
              key={product.id}
              className="bg-white shadow-md hover:transition-transform hover:scale-105 hover:shadow-2xl hover:z-10 duration-300 relative rounded-t-md"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <Link to={`/detail?name=${product.name}&productId=${product.id}`}>
                <img
                  src={"/public/images/products/" + product.images[0]}
                  alt={product.name}
                  className="h-48 sm:h-60 md:h-80 lg:h-56 object-cover w-full object-top rounded-t-md"
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
                <div className="font-bold">
                  {showFormatRupiah(product.price)}
                </div>
              </div>

              <button
                disabled={product.quantity <= 0}
                className={
                  "w-full bg-blue-600 text-white text-center py-2 rounded-b-md rounded-none absolute z-10 " +
                  (isHovered ? "block " : "hidden ") +
                  (product.quantity <= 0
                    ? "opacity-50 cursor-not-allowed "
                    : "")
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

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
              page === i + 1 ? "bg-blue-700" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
