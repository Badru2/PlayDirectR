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

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

import { showFormatRupiah } from "../../components/themes/format-rupiah";

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
    await dispatch(getProducts(), setLoading(false));
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
    setFiles(
      product.images.map((image) => ({
        source: `/public/images/products/${image}`,
        options: { type: "local" },
      }))
    );

    dispatch(getProducts());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("user_id", user.user.id);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);

    // Append images
    files.forEach((fileItem) => {
      formData.append("images", fileItem.file);
    });

    // Log FormData for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    console.log("Updating product:", formData);
    try {
      if (product.id) {
        dispatch(updateProduct({ id: product.id, formData })).then(() => {
          setLoading(true);
          // Re-fetch products after updating
          fetchProduct();
        });
      } else {
        dispatch(addProduct(formData)).then(() => {
          // Re-fetch products after adding
          fetchProduct();
        });
      }

      // Reset form
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
    dispatch(deleteProduct(id)); // Only pass product ID for deletion
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
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
                onChange={(e) => {
                  setProduct({ ...product, price: e.target.value });
                }}
                className="w-full p-2 border"
                required
              />

              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                allowReorder={true}
                credits={true}
                onChange={(e) =>
                  setProduct({ ...product, images: e.target.files })
                }
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                className={""}
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

              {/* <textarea
                placeholder="Description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                className="w-full p-2 border"
                required
              ></textarea> */}

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

              <button
                type="submit"
                className="bg-blue-400 text-white font-bold"
              >
                Submit
              </button>
            </div>
          </form>

          <div className="pt-3 space-y-3">
            {console.log("Products:", products)}
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

                  <div className="w-3/4">
                    <p>Name: {product.name}</p>
                    <p>User ID: {product.user_id}</p>
                    {/* {product.description.length > 500 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description.slice(0, 500) + "...",
                        }}
                      />
                    ) : ( */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    />
                    {/* )} */}
                    <p>Price: {showFormatRupiah(product.price)}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Category: {product.category}</p>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-300"
                    >
                      Delete
                    </button>
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
