// components/BarChart.js
import React from "react"; // Make sure to import React
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from 'chart.js';

interface BarChartProps {
    data: ChartData<'bar'>;
  }

  const BarChart: React.FC<BarChartProps> = ({ data }) => {
    return (
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>Feature Importance</h2>
        <Bar data={data} options={{
          plugins: {
            title: {
              display: true,
            }
          }
        }} />
      </div>
    );
  };
export default BarChart; // Export the component