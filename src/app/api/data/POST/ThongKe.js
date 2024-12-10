module.exports = async (req, res) => {
    const { start_date, end_date, filter } = req.body
    console.log(req.body)

    let groupBy = '';

    // Validate start_date and end_date
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.json({ message: "Ngày không hợp lệ", success: false })
    }

    switch (filter) {
        case 'day':
            groupBy = 'DAY(hd.ngayban)'; break;
        case 'month':
            groupBy = 'MONTH(hd.ngayban)'; break;
        case 'year':
            groupBy = 'YEAR(hd.ngayban)'; break;
        default:
            groupBy = 'DAY(hd.ngayban)'; break;
    }

    console.log(`groupBy: ${groupBy}`)

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const query = await conn.select(`
            SELECT 
                ${groupBy} AS order_date_grouped, 
                SUM(cthd.gia_ban) AS sum_total_grouped
            FROM 
                hoadon hd
            JOIN 
                cthoadon cthd 
            ON 
                hd.id_hoadon = cthd.id_hoadon
            WHERE 
                hd.ngayban BETWEEN '${start_date}' AND '${end_date}'
            GROUP BY 
                ${groupBy}
        `)
        console.log(query)
    } catch (error) {
        res.json({ message: error });
    }
}