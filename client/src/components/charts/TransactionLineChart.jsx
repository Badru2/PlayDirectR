// LineChart.js
import React from "react";
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
  Colors,
} from "chart.js";
import dayjs from "dayjs"; // You can use dayjs to manage dates easily
import { showFormatRupiah } from "../../components/themes/format-rupiah";

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

// Helper function to aggregate transactions by month
const getMonthlyTransactionTotals = (transactions) => {
  // Create an array to hold the totals for each month (January to December)
  const monthlyTotals = Array(12).fill(0);

  transactions.forEach((transaction) => {
    const month = dayjs(transaction.createdAt).month(); // Get the month (0 for January, 11 for December)
    monthlyTotals[month] += transaction.total; // Add the transaction total to the corresponding month
  });

  return monthlyTotals;
};

const LineChart = ({ transactions }) => {
  // Aggregate transactions by month
  const monthlyTotals = getMonthlyTransactionTotals(transactions);

  // Data for the chart
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Yearly Sales",
        data: monthlyTotals, // Use the aggregated totals
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // Chart configuration options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: false,
        text: "Sales Over Time",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const formattedValue = showFormatRupiah(value);
            return `Total : ${formattedValue}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            // Format y-axis labels as Rupiah
            return showFormatRupiah(value);
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
