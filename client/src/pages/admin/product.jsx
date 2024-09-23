import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/authSlice";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../store/productSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import axios from "axios";
import Toast from "../../components/themes/alert";

const ProductPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const user = useSelector((state) => state.auth.user);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [product, setProduct] = useState({
    id: "",
    name: "",
    user_id: "",
    images: [],
    description: "",
    price: "",
    quantity: "",
    category: "",
  });

  const fetchProduct = async () => {
    await dispatch(getProducts());
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
    dispatch(getUser());
  }, [dispatch]);

  const handleEdit = (product) => {
    setProduct({
      id: product.id,
      name: product.name,
      user_id: product.user_id,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setFiles(
      product.images.map((image) => ({
        source: `/public/images/products/${image}`,
      }))
    );
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;

    // Format the price before setting it to state
    const formatPrice = (value) => {
      let cleanValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters

      const parts = cleanValue.split(".");
      const integerPart = parts[0];
      const decimalPart = parts[1] ? `.${parts[1]}` : "";

      const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );

      return formattedInteger + decimalPart;
    };

    setProduct((prevState) => ({
      ...prevState,
      price: formatPrice(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("user_id", user.user.id);
    formData.append("description", product.description);
    formData.append("price", String(product.price).replace(/,/g, ""));
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);

    files.forEach((fileItem) => {
      formData.append("images", fileItem.file, fileItem.file.name);
    });

    try {
      if (product.id) {
        // update product
        const response = await axios.put(
          `/api/product/update/${product.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Toast.fire({ icon: "success", title: "Product updated successfully" });
        fetchProduct();
      } else {
        dispatch(addProduct(formData)).then(() => fetchProduct());
        Toast.fire({ icon: "success", title: "Product added successfully" });
      }

      setProduct({
        id: "",
        name: "",
        user_id: user.user.id,
        images: null,
        description: "",
        price: "",
        quantity: "",
        category: "",
      });

      setFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const sortedProducts = [...products].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  return (
    <div className="space-y-3">
      <div className="w-full overflow-auto shadow-md">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex bg-white p-4 shadow-md space-x-3"
        >
          <div className="flex flex-col w-1/2 space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full p-2 border"
              required
            />

            <input
              type="text"
              placeholder="Price"
              value={product.price}
              onChange={handlePriceChange}
              className="w-full p-2 border"
              required
            />

            <FilePond
              acceptedFileTypes={["image/*"]}
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={true}
              allowReorder={true}
              maxFiles={4}
              credits={true}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
          </div>

          <div className="w-1/2 flex-col flex space-y-3">
            <input
              type="text"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) =>
                setProduct({ ...product, quantity: e.target.value })
              }
              className="w-full p-2 border"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full p-2 border"
              required
            />

            <div>
              <ReactQuill
                value={product.description}
                onChange={(value) =>
                  setProduct({
                    ...product,
                    description: value,
                  })
                }
              />
            </div>

            <div className="space-x-3">
              <button
                type="reset"
                onClick={() => {
                  setFiles([]);
                  setProduct({
                    id: null,
                    name: null,
                    user_id: user.user.id,
                    images: null,
                    description: null,
                    price: null,
                    quantity: null,
                    category: null,
                  });
                }}
                className="bg-yellow-400 text-white font-bold rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-400 text-white font-bold rounded-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3 pb-5">
          <table className="w-full table bg-white shadow-md rounded-sm">
            <thead>
              <tr>
                <td className="font-bold text-xl">Name</td>
                <td className="font-bold text-xl">Price</td>
                <td className="font-bold text-xl">Quantity</td>
                <td className="font-bold text-xl">Category</td>
                <td className="font-bold text-xl">Action</td>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{showFormatRupiah(product.price)}</td>
                    <td>{product.quantity}</td>
                    <td>{product.category}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-300 rounded-sm h-8 w-16 font-bold text-white p-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white font-bold rounded-sm h-8 w-16 p-0"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    Product not found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination flex justify-center space-x-3">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={
                  currentPage === index + 1
                    ? "bg-blue-700 text-white font-bold rounded-sm"
                    : " " + "bg-blue-500 text-white font-bold rounded-sm"
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
