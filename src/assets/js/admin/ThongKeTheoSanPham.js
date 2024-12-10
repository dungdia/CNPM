// utils
const VND = new Intl.NumberFormat("Vi-VN", {
    style: "currency",
    currency: "VND",
});

let myChart

const statisticForm = document.getElementById('statistics-form');
statisticForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Kek")

    const formData = new FormData(e.target);
    console.log(formData)
    formData.append('type', 'sp');
    const req = await fetch(`/api/data/ThongKe`, {
        method: 'POST',
        body: new URLSearchParams(formData)
    })

    const res = await req.json();
    if (res.success === false) {
        return alert(res.message)
    }
    if (res.type === "warning") {
        renderChart([], [])
        return alert(res.message)
    }

    console.log(res)

    let labels = []
    let values = []

    labels = res.map(item => item.ten_sanpham)
    values = res.map(item => item.tong_gia_sp)

    // console.log(labelsm, values)
    renderChart(labels, values)
})

function renderChart(labels, values) {
    var ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng bán',
                data: values,
                backgroundColor: [
                    '#52FFB8',
                    '#1E2EDE',
                    '#F4FF52',
                    '#FF4242',
                    '#B3FFFC',
                    '#FFB842',
                    '#FF42B8',
                    '#B842FF',
                    '#42B8FF',
                    '#B8FF42',
                ],
                borderColor: [
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var label = context.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    })
}