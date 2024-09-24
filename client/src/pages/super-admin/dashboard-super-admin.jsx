import React, { useEffect, useState } from "react";
import axios from "axios";
import LineChart from "../../components/charts/TransactionLineChart";
import TransactionPieChart, {
  getProductSalesData,
} from "../../components/charts/TransactionPieChart";
import MonthlySalesLineChart from "../../components/charts/TransactionMonthly";
import MonthlyProductSalesLineChart from "../../components/charts/TransactionProductChart";
import { showFormatRupiah } from "../../components/themes/format-rupiah";

const SuperAdminDashboard = () => {
  // Set default month to current month
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(currentMonth);
  const [monthForProducts, setMonthForProducts] = useState(currentMonth);

  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [topProducts, setTopProducts] = useState({ labels: [], data: [] });

  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);

  const [historyCreate, setHistoryCreate] = useState([]);
  const [historyUpdate, setHistoryUpdate] = useState([]);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/show");
      console.log(response.data.transactions);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch products and get the top 8 best-selling ones
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/show");
      // sort by quantity in descending order (most stock first)
      response.data.products.sort((a, b) => a.quantity - b.quantity);
      // get the top 8
      const top8Products = response.data.products.slice(0, 8);
      setProducts(top8Products);
      setAllProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/auth/get/users");

      // Filter role admin
      const admins = response.data.filter(
        (user) => user.role === "adminSales" || user.role === "adminStorage"
      );
      // Filter role user
      const users = response.data.filter((user) => user.role === "user");

      setAdmins(admins);
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAdminHistory = async () => {
    try {
      const response = await axios.get("/api/history/show");

      // filter created
      const created = response.data.filter(
        (history) => history.status === "create"
      );
      // slice 5
      const createdSlice = created.slice(0, 5);
      // sort by date
      createdSlice.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      // filter updated
      const updated = response.data.filter(
        (history) => history.status === "update"
      );
      // slice 5
      const updateSlice = updated.slice(0, 5);
      // sort by date
      updateSlice.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setHistoryCreate(createdSlice);
      setHistoryUpdate(updateSlice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
    fetchUsers();
    fetchAdminHistory();
  }, []);

  // Fetch top products based on transactions
  useEffect(() => {
    const fetchTopProducts = async () => {
      if (transactions.length > 0) {
        const topProductsData = getProductSalesData(transactions); // No need for async if getProductSalesData is sync
        setTopProducts(topProductsData);
      }
    };

    fetchTopProducts();
  }, [transactions]); // Only re-run when `transactions` changes

  return (
    <div className="space-y-3 pb-12">
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-blue-500 text-white p-3 flex  text-3xl shadow-lg rounded-sm space-x-3">
          <div className="text-7xl flex items-center">
            <span className="icon-[gravity-ui--persons]"></span>
          </div>
          <div>
            <div>{users.length}</div>
            <div>Users</div>
          </div>
        </div>

        <div className="bg-green-500 text-white p-3 flex  text-3xl shadow-lg rounded-sm space-x-3">
          <div className="text-7xl flex items-center">
            <span className="icon-[ri--admin-fill]"></span>
          </div>
          <div>
            <div>{admins.length}</div>
            <div>Admins</div>
          </div>
        </div>

        <div className="bg-red-500 text-white p-3 flex  text-3xl shadow-lg rounded-sm space-x-3">
          <div className="text-7xl flex items-center">
            <span className="icon-[tdesign--undertake-transaction]"></span>
          </div>
          <div>
            <div>{transactions.length}</div>
            <div>Transactions</div>
          </div>
        </div>

        <div className="bg-yellow-500 text-white p-3 flex  text-3xl shadow-lg rounded-sm space-x-3">
          <div className="text-7xl flex items-center">
            <span className="icon-[icon-park-outline--ad-product]"></span>
          </div>
          <div>
            <div>{allProducts.length}</div>
            <div>Products</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {/* Sales Line Chart */}
        <div className="w-1/2 bg-white p-3 shadow-lg">
          <h1 className="text-2xl font-bold mb-3">Yearly Sales</h1>
          <LineChart transactions={transactions} />
        </div>

        {/* Most Popular Products */}
        <div className="w-1/2 bg-white p-3 shadow-lg max-h-[500px] flex">
          <div className="w-1/2 flex flex-col space-y-5">
            <h1 className="text-2xl font-bold mb-3">Best Selling Products</h1>
            <div>
              {topProducts.labels.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b-2 border-gray-200 py-2"
                >
                  <p className="text-lg font-bold">{label}</p>
                  <p className="text-lg font-bold">{topProducts.data[index]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart for Most Popular Products */}
          <div className="w-1/2 flex justify-center items-center">
            <TransactionPieChart
              transactions={transactions}
              width={310}
              height={310}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <div className="w-2/5">
          <div className="bg-white p-3 shadow-lg w-full">
            <table className="table">
              <thead>
                <tr className="text-xl font-bold">
                  <td>Name</td>
                  <td>Stock</td>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td className="font-bold">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-3/5">
          <div className="py-3 bg-white w-full shadow-lg max-h-[435px] space-y-2">
            <div className="px-10 flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">Monthly Sales</h1>
              </div>

              {/* Month Selector */}
              <select
                onChange={(e) => setMonth(Number(e.target.value))} // Ensure the month is a number
                value={month} // Set the default selected month to the current month
                className="w-1/3 p-2 border border-gray-300 rounded-md"
              >
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </select>
            </div>

            {/* Monthly Sales Line Chart */}
            <div className="flex justify-center">
              <MonthlySalesLineChart
                transactions={transactions}
                month={month}
                width={800}
                height={370}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <div className="w-3/5">
          <div className="py-3 bg-white w-full shadow-lg space-y-3">
            <div className="px-10 flex justify-between">
              <div className="text-2xl font-bold">Monthly Transactions</div>

              <select
                onChange={(e) => setMonthForProducts(Number(e.target.value))} // Ensure the month is a number
                value={monthForProducts} // Set the default selected month to the current month
                className="w-1/3 p-2 border border-gray-300 rounded-md"
              >
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </select>
            </div>

            <div className="flex justify-center">
              <MonthlyProductSalesLineChart
                transactions={transactions}
                month={monthForProducts}
                width={800}
                height={370}
              />
            </div>
          </div>
        </div>

        <div className="w-2/5">
          <div className="py-3 bg-white w-full shadow-lg"></div>
        </div>
      </div>

      <div className="flex space-x-3">
        <div className="w-1/2">
          <div className="bg-white p-3 shadow-lg w-full">
            <div className="text-2xl font-bold p-3">Admin Created History</div>

            <table className="table">
              <thead>
                <tr className="text-xl font-bold">
                  <td>User</td>
                  <td>Product</td>
                  <td>Price</td>
                  <td>Stock</td>
                </tr>
              </thead>

              <tbody>
                {historyCreate.length > 0 ? (
                  historyCreate.map((history) => (
                    <tr key={history.id}>
                      <td>{history.User.username}</td>
                      <td>{history.new_product_name}</td>
                      <td>{showFormatRupiah(history.new_product_price)}</td>
                      <td>{history.new_product_quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/2">
          <div className="bg-white p-3 shadow-lg w-full">
            <div className="text-2xl font-bold p-3">Admin Updated History</div>
            <table className="table">
              <thead>
                <tr className="text-xl font-bold">
                  <td>User</td>
                  <td>Product</td>
                  <td>Old Price</td>
                  <td>New Price</td>
                </tr>
              </thead>

              <tbody>
                {historyUpdate.length > 0 ? (
                  historyUpdate.map((history) => (
                    <tr key={history.id}>
                      <td>{history.User.username}</td>
                      <td>{history.old_product_name}</td>
                      <td>{showFormatRupiah(history.old_product_price)}</td>
                      <td>{showFormatRupiah(history.new_product_price)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
