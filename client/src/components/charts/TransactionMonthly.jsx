import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { showFormatRupiah } from "../themes/format-rupiah";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesLineChart = ({ transactions, month, width, height }) => {
  // Helper function to get sales data for a specific month
  const getSalesByDayInMonth = (transactions, month) => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      month + 1,
      0
    ).getDate(); // Get the number of days in the month
    const salesByDay = Array(daysInMonth).fill(0); // Create an array with the correct length

    // Filter transactions by the given month
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = transactionDate.getMonth(); // Get month (0 = January, 1 = February, etc.)
      const transactionDay = transactionDate.getDate(); // Get day of the month

      // If the transaction is in the given month, add its total to the corresponding day
      if (transactionMonth === month) {
        salesByDay[transactionDay - 1] += transaction.total;
      }
    });

    return salesByDay;
  };

  // Memoize the filtered sales data so it only recalculates when transactions or month change
  const dailySales = useMemo(
    () => getSalesByDayInMonth(transactions, month),
    [transactions, month]
  );

  // Get the number of days in the selected month for labels
  const daysInMonth = new Date(
    new Date().getFullYear(),
    month + 1,
    0
  ).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);

  // Prepare chart data
  const data = {
    labels: labels, // Use dynamic labels
    datasets: [
      {
        label: "Sales",
        data: dailySales,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1, // Adds a little curve to the line
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Sales Per Day",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const formattedValue = showFormatRupiah(value);
            return `Total: ${formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Day of the Month",
        },
      },
      y: {
        title: {
          display: false,
          text: "Sales Amount",
        },
        ticks: {
          callback: function (value) {
            // Format y-axis labels as Rupiah
            return showFormatRupiah(value);
          },
        },
      },
    },
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Line data={data} options={options} width={width} height={height} />
    </div>
  );
};

export default MonthlySalesLineChart;
