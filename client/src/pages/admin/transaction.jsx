import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getTransactions,
  updateTransaction,
} from "../../store/transactionSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { Helmet } from "react-helmet";

const AdminTransaction = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [activeTransactionId, setActiveTransactionId] = useState(null); // State to control accordion
  const [status, setStatus] = useState("pending");

  const fetchTransactions = async () => {
    try {
      const response = await dispatch(getTransactions()).unwrap();

      const filteredTransactions = response.transactions.filter(
        (transaction) => transaction.status === status
      );

      const sortedTransactions = filteredTransactions.sort((a, b) => {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      });

      setTransactions(sortedTransactions);
      setLoading(false); // Set loading false after transactions are fetched
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false); // Ensure loading is set to false on error too
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [dispatch, status]); // Add dispatch as dependency

  const handleAccordionToggle = (transactionId) => {
    setActiveTransactionId(
      transactionId === activeTransactionId ? null : transactionId
    );
  };

  const handleUpdateTransaction = async (transactionId, status) => {
    try {
      console.log("Updating transaction:", transactionId, status);
      await dispatch(
        updateTransaction({
          transactionId,
          status,
        })
      ).unwrap();

      fetchTransactions();
      console.log("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="pb-12">
      <Helmet>
        <title>Admin | Transaction</title>
      </Helmet>

      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="w-full flex">
            <div className="bg-white p-4 shadow-md sticky top-16">
              <label htmlFor="status" className="border">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full py-3 px-2 rounded-sm border"
                >
                  <option value="pending">Pending</option>
                  <option value="on-Packing">Accept</option>
                  <option value="deliver">Deliver</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>
          </div>

          <div className="w-full space-y-3 join join-vertical">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white p-4 shadow-md collapse collapse-arrow join-item border-base-300 border"
              >
                <input
                  type="radio"
                  name="my-accordion-4"
                  checked={activeTransactionId === transaction.id}
                  onChange={() => handleAccordionToggle(transaction.id)} // Toggle accordion
                />
                <div className="flex justify-between collapse-title">
                  <div>
                    <div>
                      User: <b>{transaction.User.username}</b>
                    </div>
                    <div>
                      Total: <b>{showFormatRupiah(transaction.total)}</b>
                    </div>
                  </div>

                  <div>
                    <div>
                      Transaction Date:{" "}
                      <b>{new Date(transaction.updatedAt).toDateString()}</b>
                    </div>
                    <div>
                      Status: <b className="uppercase">{transaction.status}</b>
                    </div>
                  </div>
                </div>

                {activeTransactionId === transaction.id && (
                  <div className="collapse-content flex flex-col">
                    <div className="space-y-3">
                      {transaction.products.map((product) => (
                        <div key={product.id}>
                          <div className="flex space-x-3">
                            <div>
                              <img
                                src={`/public/images/products/${product.image}`}
                                alt={product.product_name}
                                className="h-[70px] w-[70px] object-cover rounded-md"
                              />
                            </div>

                            <div>
                              <div>
                                <b>{product.product_name}</b>
                              </div>
                              <div>
                                <b>{showFormatRupiah(product.price)}</b>
                              </div>
                              <div>
                                Quantity:
                                <b>{product.quantity}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {transaction.status === "on-Packing" || "pending" ? (
                      <div className="flex space-x-3 self-end">
                        {transaction.status !== "on-Packing" ? (
                          <button
                            onClick={() =>
                              handleUpdateTransaction(
                                transaction.id,
                                "on-Packing"
                              )
                            }
                            className="bg-blue-500 text-white font-bold rounded-sm"
                          >
                            Accept
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUpdateTransaction(transaction.id, "deliver")
                            }
                            className="bg-green-500 text-white font-bold rounded-sm"
                          >
                            Deliver
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleUpdateTransaction(transaction.id, "cancelled")
                          }
                          className="bg-red-500 text-white font-bold rounded-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransaction;
