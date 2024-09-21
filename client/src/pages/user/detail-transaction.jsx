import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { detailUserTransaction } from "../../store/transactionSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { Link, useLocation } from "react-router-dom";

const DetailTransaction = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const transactionId = new URLSearchParams(useLocation().search).get(
    "transactionId"
  );
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fecthTransaction = async () => {
      try {
        const response = await dispatch(
          detailUserTransaction({
            userId: user.id,
            transactionId: Number(transactionId),
          })
        );

        console.log("this is the response", response.payload.transactions);
        setTransaction(response.payload.transactions);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching transaction:", error);
      }
    };

    fecthTransaction();
  }, []);

  return (
    <div>
      <div>
        {loading ? (
          <div>
            <div>Loading...</div>
          </div>
        ) : (
          <div className="mx-2 lg:mx-0">
            <div className="space-y-3 w-full lg:w-1/2 mx-auto mb-5">
              {transaction && (
                <div
                  key={transaction.id}
                  className="bg-white shadow-md p-4 space-y-3 w-full"
                >
                  <div className="flex justify-between">
                    <div>
                      <div>
                        Transaction ID: <b>{transaction.id}</b>
                      </div>
                      <div>
                        Transaction Date:{" "}
                        <b>{new Date(transaction.createdAt).toDateString()}</b>
                      </div>
                    </div>
                    <div>
                      <div>
                        Status:{" "}
                        <b className="uppercase">{transaction.status}</b>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xl lg:text-lg">
                      Total Price: <b>{showFormatRupiah(transaction.total)}</b>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transaction.products.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 space-y-3 flex flex-col-reverse lg:flex-row w-full justify-between border-t border-gray-500"
                      >
                        <div className="flex flex-col justify-between">
                          <div className="space-y-3 pt-4">
                            <div className="text-xl lg:text-2xl">
                              <b>{product.product_name}</b>
                            </div>

                            <div>
                              <div className="text-xl lg:text-2xl">
                                <b>{showFormatRupiah(product.price)}</b>
                              </div>
                            </div>

                            <div>
                              Quantity: <b>{product.quantity}</b>
                            </div>
                          </div>

                          <div className="text-xl">
                            Total:{" "}
                            <b>
                              {showFormatRupiah(
                                product.price * product.quantity
                              )}
                            </b>
                          </div>
                        </div>

                        <img
                          src={`/public/images/products/${product.image}`}
                          alt={product.product_name}
                          className="h-80 w-full md:max-w-[150px] lg:max-w-[300px] object-contain rounded-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailTransaction;
