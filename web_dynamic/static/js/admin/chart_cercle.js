var chartDataElement = document.getElementById("chart-data");

if (chartDataElement) {
  var chartData = JSON.parse(chartDataElement.textContent);

  console.log(chartData);
} else {
  console.error("Chart data not found.");
}


const matrixData = [
  chartData.pending,
  chartData.confirmed,
  chartData.delivered,
  chartData.cancelled,
];



console.log(matrixData)

const ctx = document.getElementById('matrixChart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Pending ⌛', 'confirmed ✅', 'delivered 🚚', 'cancelled ❌'],
    datasets: [{
      label: 'orders 📦',
      data: matrixData,
      backgroundColor: [
        '#F8BD0C',
        '#0066B0',
        '#00A944',
        '#E0370D',
      ],
      borderColor: [
        '#040D12',
      ],
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
          text: 'Order status',
          color: '#040D12',
          padding: {
            bottom: 20
          },
          font: {
            size: 25,
            family: 'serif',
            color: "#000",
            weight: 'bold'
          }
      },
      legend: {
        display: true,
        position: 'left',
        labels: {
          font: {
            size: 17,
            family: 'Times, Times New Roman, serif',
            color: "#000",
            weight: 'lighter'
          },
          boxWidth: 50,
          boxHeight: 20,
          color: "#000",
          usePointStyle: true,
          pointStyle: 'rectRounded',
          pointStyleWidth: 40
        },
      }
    }
  }
});
