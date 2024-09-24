// PieChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to aggregate product sales and get top 5
export const getProductSalesData = (transactions) => {
  const productSales = {};

  // Sum sales per product
  transactions.forEach((transaction) => {
    // filter by status
    if (transaction.status === "finish") {
      transaction.products.forEach((product) => {
        if (productSales[product.product_name]) {
          productSales[product.product_name] += product.quantity;
        } else {
          productSales[product.product_name] = product.quantity;
        }
      });
    }
  });

  // Convert the productSales object into an array of product objects
  const productSalesArray = Object.entries(productSales).map(
    ([name, quantity]) => ({
      name,
      quantity,
    })
  );

  // Sort the array by quantity in descending order and get top 5
  const top5Products = productSalesArray
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Extract the labels (product names) and data (quantities)
  const labels = top5Products.map((product) => product.name);
  const data = top5Products.map((product) => product.quantity);

  return { labels, data };
};

const PieChart = ({ transactions, width, height }) => {
  // Aggregate product sales data
  const { labels, data } = getProductSalesData(transactions);

  // Data for the chart
  const chartData = {
    labels, // Top 5 product names
    datasets: [
      {
        label: "Top 5 Most Selling Products",
        data, // Top 5 sales quantities
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Chart configuration options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // set to false to hide legend
        width: 200,
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "black",
        },
      },
      title: {
        display: false,
        text: "Top 5 Most Selling Products",
      },
    },
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Pie data={chartData} options={options} width={width} height={height} />
    </div>
  );
};

export default PieChart;
