const decodeJWT = require('../../../../utils/decodeJWT')

module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const { taikhoan_id, vaitro_id } = req.query

        if (!taikhoan_id) {
            return res.json({ message: "No user_id !!!" })
        }

        const permissions = {
            isAdmin: false,
            product: {
                add: false,
                addImg: false,
                update: false,
                delete: false,
            },
            deleteUser: false,
            order: {
                approve: false,
                confirmRecived: false,
            },
            employee: {
                add: false,
                update: false,
                delete: false,
            },
            role: {
                add: false,
                update: false,
                delete: false,
            },
            statistics: false
        }

        let roleUser
        const getRoleUser = await conn.select(`
            SELECT t.vaitro_id 
            FROM taikhoan t 
            WHERE t.id_taikhoan = ?
        `, [taikhoan_id])

        if (getRoleUser.length > 0) {
            if (getRoleUser[0].vaitro_id === 1) {
                return res.json(permissions)
            }
            roleUser = getRoleUser[0].vaitro_id
        }
        permissions.isAdmin = true

        if (vaitro_id) {
            roleUser = vaitro_id
        }

        const getPermissionList = await conn.select(`
            SELECT q.ten_quyen 
            FROM quyen q
            JOIN ctquyen ctq ON q.id_quyen = ctq.id_quyen 
            WHERE id_vaitro = ?
        `, [roleUser])

        if (getPermissionList.length > 0) {
            for (const role of getPermissionList) {
                switch (role.ten_quyen) {
                    case 'Thêm sản phẩm':
                        permissions.product.add = true;
                        break;
                    case 'Thêm hình ảnh sản phẩm':
                        permissions.product.addImg = true;
                        break;
                    case 'Sửa sản phẩm':
                        permissions.product.update = true;
                        break;
                    case 'Xóa sản phẩm':
                        permissions.product.delete = true;
                        break;
                    case 'Xóa tài khoản khách hàng':
                        permissions.deleteUser = true;
                        break;
                    case 'Xứ lý hóa đơn':
                        permissions.order.approve = true;
                        break;
                    case 'Xác nhận đã giao hàng':
                        permissions.order.confirmRecived = true;
                        break;
                    case 'Thêm tài khoản nhân viên':
                        permissions.employee.add = true;
                        break;
                    case 'Sửa tài khoản nhân viên':
                        permissions.employee.update = true;
                        break;
                    case 'Xóa tài khoản nhân viên':
                        permissions.employee.delete = true;
                        break;
                    case 'Thêm role':
                        permissions.role.add = true;
                        break;
                    case 'Sửa role':
                        permissions.role.update = true;
                        break;
                    case 'Xóa role':
                        permissions.role.delete = true;
                        break;
                    case 'Xem thống kê':
                        permissions.statistics = true;
                        break;
                }
            }
        }
        conn.closeConnect();
        return res.json(permissions)
    } catch (error) {
        console.log(error);
    }
}