import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // This will auto-register all necessary chart components

const OrderLineChart = ({ orders }) => {
  // Prepare data for the chart
  const chartData = {
    labels: orders.map((order) =>
      new Date(order.createdAt).toLocaleDateString()
    ), // Dates from the orders
    datasets: [
      {
        label: "Order Total",
        data: orders.map((order) => order.total), // Totals from each order
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Order Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default OrderLineChart;
