const chartCanvas = document.querySelector("canvas");

const timestamps = [];
const priceInINR = [];
let xLabels = [];
let yLabels = [];
var index = 1;

fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=inr&days=5")
    .then((data) => {
        return data.json();
    })
    .then((data) => {
        console.log(data);
        data.prices.forEach((dt) => {
            const date_obj = new Date(dt[0]);

            let hours = date_obj.getHours();
            if(hours < 10) {
                hours = "0" + hours;
            }

            let minutes = date_obj.getMinutes();
            if(minutes < 10) {
                minutes = "0" + minutes;
            }

            timestamps.push(`${hours}:${minutes}`);
            priceInINR.push(dt[1]);
            
        });

        xLabels.push(timestamps[0]);
        yLabels.push(priceInINR[0]);

        const myChart = new Chart("lineChart", {
            type: "line",
            data: {
                labels: xLabels,
                datasets: [{
                    label : "Prices in INR",
                    data : yLabels,
                    backgroundColor : "rgba(75, 192, 192, 0.2)",
                    borderColor : "rgb(75, 192, 192)",
                    borderWidth : 1,
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Bitcoin Historical Chart Data"
                    }
                },
                scales : {
                    y : {
                        beginAtZero : false
                    }
                }
            }
        });

        setInterval(() => {
            addDataWithAnimation(myChart);
        }, 1000);

        // console.log(timestapms, priceInINR);
    })
    .catch((err) => {
        console.log(err);
    });

function addDataWithAnimation(chart) {
    const newX = timestamps[index];
    const newY = priceInINR[index];
    index++;
    chart.data.labels.push(newX);
    chart.data.datasets[0].data.push(newY);
    chart.update();

    const canvas = chart.canvas;

    // Set initial scale to 0.9 (90% of its original size)
    canvas.style.transform = 'scale(0.9)';
    
    // Animate the scale back to its original size (1) over 500ms
    anime({
        targets: canvas,
        scale: [0.9, 1],
        easing: 'easeInOutQuad',
        duration: 500
    });
}

// anime({
//     targets: canvas,
//     translateY: [0, -10, 5, 0],
//     loop: true,
//     duration: 5000,
//     easing: 'linear',
//     direction : 'alternate',
//     autplay : false
// });
