let myChart

function renderChart(labels, values) {
    var ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

renderChart([])
const statisticForm = document.getElementById('statistics-form');
statisticForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // console.log("Kek")

    const formData = new FormData(e.target);
    const alertMessage = document.getElementById('alert-warning');
    formData.append('type', 'thoi_gian');
    const req = await fetch(`/api/data/ThongKe`, {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    const res = await req.json();

    if (res.success === false) {
        alert(res.message)
        return
    }
    if (res.type === "warning") {
        
        alertMessage.removeAttribute('style');
        alertMessage.innerHTML = res.message;
        return
    } else {
        alertMessage.style.display = "none"
        alertMessage.innerHTML = "";
    }

    let labels = []
    let values = []
    switch (res["order_by"]) {
        case "day":
            labels = res["group"].map(item => `Ngày ${item.order_grouped}`)
            values = res["group"].map(item => item.sum_total_grouped)
            break;
        case "month":
            labels = res["group"].map(item => `Tháng ${item.order_grouped}`)
            values = res["group"].map(item => item.sum_total_grouped)
            break;
        case "year":
            labels = res["group"].map(item => `Năm ${item.order_grouped}`)
            values = res["group"].map(item => item.sum_total_grouped)
            break;
    }
    myChart.destroy();
    renderChart(labels, values)
})


