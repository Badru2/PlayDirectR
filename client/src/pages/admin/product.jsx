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

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

import { showFormatRupiah } from "../../components/themes/format-rupiah";
import axios from "axios";

const ProductPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products); // Ensure state path is correct
  const user = useSelector((state) => state.auth.user);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    id: "",
    name: "",
    user_id: "",
    images: [], // If you handle image uploads, you'd need a proper field here.
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
    setLoading(false);
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
    }); // Pre-fill form for editing

    // Map product images to be used by FilePond
    setFiles(
      product.images.map((image) => ({
        source: `/public/images/products/${image}`, // Use the actual path to the image
        // options: {
        //   type: "local", // FilePond treats this as a local file
        // },
      }))
    );
  };

  const formatPrice = (value) => {
    // Remove all non-digit characters (except for decimal point)
    let cleanValue = value.replace(/[^0-9.]/g, "");

    // Split the integer and decimal parts if a decimal point exists
    const parts = cleanValue.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] ? `.${parts[1]}` : "";

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedInteger + decimalPart;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
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

    // Append images from FilePond
    files.forEach((fileItem) => {
      formData.append("images", fileItem.file);
    });

    console.log("Updating product:", formData);
    try {
      if (product.id) {
        // Update product
        const response = await axios.put(
          `/api/product/update/${product.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setLoading(true);
        console.log("Updating product:", response.data);
        fetchProduct();

        // dispatch(updateProduct({ id: product.id, formData })).then(() => {
        //   setLoading(true);
        //   fetchProduct();
        // });
      } else {
        dispatch(addProduct(formData)).then(() => {
          fetchProduct();
        });
      }

      // Reset form after submission
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

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex space-x-3">
          <div className="w-1/2 overflow-auto">
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
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
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

                <div>
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
                    className="bg-yellow-400 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-400 text-white font-bold"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-3 w-1/2">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 shadow-md flex space-x-3"
                >
                  <div className="w-1/4">
                    <img
                      src={`/public/images/products/${product.images[0]}`}
                      alt={product.name}
                      className="w-full object-cover"
                    />
                  </div>

                  <div className="w-3/4 space-y-2">
                    <div>
                      <div className="font-bold text-xl">{product.name}</div>
                      <div className="font-bold text-xl">
                        {showFormatRupiah(product.price)}
                      </div>
                    </div>

                    <div>
                      <div>Quantity: {product.quantity}</div>
                      <div>Category: {product.category}</div>
                    </div>

                    <div className="space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-300 rounded-sm h-8 w-16 font-bold text-white p-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 rounded-sm h-8 w-16 font-bold text-white p-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Product not found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
