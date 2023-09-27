// components/BarChart.js
import React from "react"; // Make sure to import React
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface BarChartProps {
    data: ChartData<'bar'>;
    title?: boolean
  }

  const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    return (
      <div className="chart-container" style={{width: "100%", marginTop: "1rem", marginBottom: "1rem"}}>
       {title !== false && <h2 style={{ textAlign: "center" }}>Feature Importance</h2>}
        <Bar data={data} 
        plugins={[ChartDataLabels]}
        options={{
          plugins: {
            datalabels: {
              align: 'end',
              anchor: 'end'
            },
            title: {
              display: true,
            },
            legend: {
              display: false,
              title: {
                display: true,
                text: "Features"

              }
            }
          }
        }} />
      </div>
    );
  };
export default BarChart; // Export the component