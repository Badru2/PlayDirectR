import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import {
  getUserTransactions,
  updateTransaction,
} from "../../store/transactionSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { Link } from "react-router-dom";

const UserTransaction = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await dispatch(getUserTransactions(user.id)).unwrap();

      const sortTranscation = response.transactions.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      console.log(sortTranscation);
      setTransactions(sortTranscation); // Set transactions as the sorted array
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false); // Move loading state update here
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, [dispatch, user.id]); // Add dependencies to avoid warnings

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
    <div>
      {loading ? (
        <div>
          <div>Loading...</div>
        </div>
      ) : (
        <div>
          <div className="space-y-3 w-1/2 mx-auto">
            {transactions.map(
              (
                transaction // Map over transactions directly
              ) => (
                <div
                  key={transaction.id}
                  className="bg-white shadow-md p-4 space-y-3"
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
                        Transaction Status:{" "}
                        <b className="uppercase">{transaction.status}</b>
                      </div>
                      <div>
                        Total Price:{" "}
                        <b>{showFormatRupiah(transaction.total)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div>
                      <img
                        src={`/public/images/products/${transaction.products[0].image}`}
                        alt=""
                        className="h-80 w-full object-contain"
                      />
                    </div>
                    <div>
                      Product Name: {transaction.products[0].product_name}
                    </div>
                    <div>
                      Product Price:{" "}
                      {showFormatRupiah(transaction.products[0].price)}
                    </div>
                  </div>

                  <div className="flex space-x-3 self-end justify-between">
                    <Link
                      to={`/transaction/detail?transactionId=${transaction.id}`}
                      className="bg-blue-500 text-white font-bold rounded-sm px-6 flex items-center "
                    >
                      Detail
                    </Link>

                    <div>
                      {transaction.status == "pending" ||
                      transaction.status == "cancelled" ? (
                        <button
                          disabled={transaction.status == "cancelled"}
                          onClick={() =>
                            handleUpdateTransaction(transaction.id, "cancelled")
                          }
                          className={
                            "bg-red-500 text-white font-bold rounded-sm " +
                            (transaction.status == "cancelled"
                              ? "cursor-not-allowed opacity-50"
                              : "")
                          }
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleUpdateTransaction(transaction.id, "finish")
                          }
                          className={
                            "bg-green-500 text-white font-bold rounded-sm " +
                            (transaction.status == "finish"
                              ? "cursor-not-allowed opacity-50"
                              : "")
                          }
                        >
                          Finish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTransaction;
