// Data for the chart
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [{
      label: 'earning',
      backgroundColor: [
        '#379237',
    ],
      borderColor: '#54B435',
      data: [10, 20, 15, 25, 30, 35, 40, 45, 50, 45, 35, 25],
  }]
};

// Configuration options
const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
          text: 'Yearly Earnings Chart',
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
        display: false
      }
    }
  }
};

// Create the chart
var myChart = new Chart(
  document.getElementById('myChart'),
  config
);