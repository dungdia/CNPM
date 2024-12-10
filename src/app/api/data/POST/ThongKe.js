module.exports = async (req, res) => {
    const { start_date, end_date, filter, type } = req.body
    console.log(req.body)

    let groupBy = '';

    // Validate start_date and end_date
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start.getTime())) {
        return res.json({ message: "Ngày bắt đầu không hợp lệ", success: false })
    }
    if (isNaN(end.getTime())) {
        return res.json({ message: "Ngày kết thúc không hợp lệ", success: false })
    }

    if (start > end) {
        return res.json({ message: "Ngày bắt đầu không được lớn hơn ngày kết thúc", success: false })
    }

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        if (type === "thoi_gian") {
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

            const query = await conn.select(`
                SELECT 
                    ${groupBy} AS order_grouped, 
                    SUM(cthd.gia_ban) AS sum_total_grouped
                FROM 
                    hoadon hd
                JOIN 
                    cthoadon cthd 
                ON 
                    hd.id_hoadon = cthd.id_hoadon
                WHERE 
                    hd.ngayban BETWEEN ? AND ? AND hd.id_trangthaiHD != 5
                GROUP BY 
                    ${groupBy}
            `, [start_date, end_date])

            if (query.length === 0) {
                return res.json({ message: `Không có sản phẩm bán được trong khoảng thời gian từ ${start_date} đến ${end_date}`, type: "warning" })
            }

            // console.log(query)

            let data = {
                group: [],
                order_by: ""
            }

            switch (filter) {
                case 'day':
                    for (const item of query) {
                        data.group.push({
                            order_grouped: item.order_grouped,
                            sum_total_grouped: item.sum_total_grouped,
                        })
                    }
                    data.order_by = 'day'
                    console.log(data)
                    return res.json(data)
                case 'month':
                    for (const item of query) {
                        data.group.push({
                            order_grouped: item.order_grouped,
                            sum_total_grouped: item.sum_total_grouped,
                        })
                    }
                    data.order_by = 'month'
                    return res.json(data)
                case 'year':
                    for (const item of query) {
                        data.group.push({
                            order_grouped: item.order_grouped,
                            sum_total_grouped: item.sum_total_grouped,
                        })
                    }
                    data.order_by = 'year'
                    return res.json(data)
            }
        }
        if (type === "sp") {
            console.log("sp")

            const query = await conn.select(`
                SELECT sp.ten_sanpham , sum(cthd.gia_ban) as tong_gia_sp
                FROM 
                    hoadon hd 
                JOIN 
                    cthoadon cthd on hd.id_hoadon = cthd.id_hoadon 
                JOIN 
                    ctsanpham ctsp on ctsp.imei = cthd.imei 
                JOIN 
                    phienbansanpham pbsp ON pbsp.id_phienban = ctsp.pbSanPham_id 
                JOIN 
                    sanpham sp on sp.id_sanpham = pbsp.id_sanpham 
                WHERE 
                    hd.ngayban between ? and ?
                GROUP BY 
                    sp.id_sanpham
                ORDER BY 
                    tong_gia_sp desc
                LIMIT 10    
            `, [start_date, end_date])

            if (query.length === 0) {
                return res.json({ message: `Không có sản phẩm bán được trong khoảng thời gian từ ${start_date} đến ${end_date}`, type: "warning" })
            }
            console.log(query)
            res.json(query)
        }
    } catch (error) {
        console.log(error)
    }
}