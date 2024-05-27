var chartDataElement = document.getElementById("chart-data");

if (chartDataElement) {
  var chartData = JSON.parse(chartDataElement.textContent);
} else {
  console.error("Chart data not found.");
}


const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [{
      label: 'earning',
      backgroundColor: [
        '#379237',
    ],
      borderColor: '#54B435',
      data: chartData.earning,
  }]
};

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

var myChart = new Chart(
  document.getElementById('myChart'),
  config
);