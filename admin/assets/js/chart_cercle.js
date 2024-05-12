// Sample matrix data (replace with your actual data)
const matrixData = [
  [10, 20, 30],
  [15, 25, 35],
  [5, 10, 15]
];

// Calculate sum of each row in the matrix
const rowSums = matrixData.map(row => row.reduce((acc, val) => acc + val, 0));

// Get canvas element
const ctx = document.getElementById('matrixChart').getContext('2d');

// Create doughnut chart
const chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['pending', 'shipped', 'delivered'],
    datasets: [{
      label: 'earning in $',
      data: rowSums,
      backgroundColor: [
        '#F6D776',
        '#6DB9EF',
        '#41B06E'
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
