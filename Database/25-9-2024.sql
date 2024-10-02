CREATE TABLE `ctsanpham` (
  `imei` varchar(255) PRIMARY KEY NOT NULL,
  `pbSanPham_id` int(11) DEFAULT null,
  `phieuNhap_id` int(11) DEFAULT null,
  `trangThai` int(11) DEFAULT 1
);

CREATE TABLE `sanpham` (
  `id_sanpham` int(11) PRIMARY KEY NOT NULL,
  `ten_sanpham` varchar(255) DEFAULT null,
  `hinhAnh` varchar(255) DEFAULT null,
  `kichThuocMan` float DEFAULT null,
  `cameraSau` varchar(255) DEFAULT null,
  `cameraTruoc` varchar(255) DEFAULT null,
  `chipXuLy` varchar(255) DEFAULT null,
  `heDieuHanh` varchar(255) DEFAULT null,
  `dungLuongPin` int(11) DEFAULT null,
  `id_thuongthieu` int(11) DEFAULT null,
  `trangThai` int(11) DEFAULT 1
);

CREATE TABLE `img_sanpham` (
  `id_img` int(11) PRIMARY KEY NOT NULL,
  `id_sanpham` int(11),
  `img` blob,
  `trang_thai` int(11) DEFAULT 1
);

CREATE TABLE `Thuonghieu` (
  `id_thuonghieu` int(11) PRIMARY KEY NOT NULL,
  `ten_thuonghieu` varchar(255),
  `trangthai` varchar(255)
);

CREATE TABLE `PhienBanSanPham` (
  `id_phienban` int(11) PRIMARY KEY NOT NULL,
  `id_sanpham` int(11),
  `ram` int(11),
  `dung_luong` int(11),
  `id_BaoHanh` int(11),
  `trangthai` int(11) DEFAULT 1
);

CREATE TABLE `PhieuNhap` (
  `id_phieunhap` int(11) PRIMARY KEY NOT NULL,
  `ngaynhap` datetime,
  `id_nhanvien` int(11),
  `id_nhacungcap` int(11),
  `trangthai` int DEFAULT 1
);

CREATE TABLE `CtPhieuNhap` (
  `id_phieunhap` int(11) NOT NULL,
  `id_phienbansp` int(11) NOT NULL,
  `so_luong` int(11),
  `gia` bigint(19),
  PRIMARY KEY (`id_phieunhap`, `id_phienbansp`)
);

CREATE TABLE `NhanVien` (
  `id_nhanvien` int(11) PRIMARY KEY NOT NULL,
  `id_taikhoan` int(11),
  `ho_ten` varchar(255),
  `gioi_tinh` int,
  `sodienthoai` varchar(255),
  `email` varchar(255),
  `trangthai` int DEFAULT 1
);

CREATE TABLE `NhaCungCap` (
  `id_nhacungcap` int(11) PRIMARY KEY NOT NULL,
  `ten_nhacungcap` varchar(255),
  `diachia` varchar(255),
  `sodienthoai` varchar(255),
  `trangthai` int DEFAULT 1
);

CREATE TABLE `TaiKhoan` (
  `id_taikhoan` int(11) PRIMARY KEY NOT NULL,
  `user_name` varchar(255),
  `password` varchar(255),
  `vaitro_id` int(11) NOT NULL DEFAULT 1,
  `ngaythamgia` datetime,
  `trangthai` int DEFAULT 1
);

CREATE TABLE `KhachHang` (
  `id_khachhang` int(11) PRIMARY KEY NOT NULL,
  `id_taikhoan` int(11),
  `ho_ten` varchar(255),
  `diachia` varchar(255),
  `sodienthoai` varchar(255),
  `trangthai` int(11) DEFAULT 1
);

CREATE TABLE `GioHang` (
  `id_giohang` int(11) PRIMARY KEY NOT NULL,
  `id_khachhang` int(11) NOT NULL
);

CREATE TABLE `CtGioHang` (
  `id_giohang` int(11) NOT NULL,
  `imei` varchar(255) NOT NULL,
  PRIMARY KEY (`id_giohang`, `imei`)
);

CREATE TABLE `HoaDon` (
  `id_hoadon` int(11) PRIMARY KEY NOT NULL,
  `id_khachhang` int(11),
  `id_trangthaiHD` int(11),
  `note` varchar(11),
  `ngayban` datetime,
  `trangthai` int DEFAULT 1
);

CREATE TABLE `TrangThaiHD` (
  `id_trangthaiHD` int(11) PRIMARY KEY NOT NULL,
  `ten_trangthai` varchar(255)
);

CREATE TABLE `Baohanh` (
  `id_baohanh` int(11) PRIMARY KEY NOT NULL,
  `sothang` int(11)
);

CREATE TABLE `CTHoaDon` (
  `id_hoadon` int(11) NOT NULL,
  `imei` varchar(255) NOT NULL,
  `ngaykethuc_baohanh` datetime,
  `gia_ban` int(11),
  PRIMARY KEY (`id_hoadon`, `imei`)
);

CREATE TABLE `PhieuBaoHanh` (
  `imei` int,
  `id_hoadon` int,
  `ngay_BaoHanh` datetime,
  `ngay_tra` datetime,
  `Tinh_trang_may` varchar(255),
  `trang_thai` int DEFAULT 1,
  PRIMARY KEY (`imei`, `id_hoadon`)
);

CREATE TABLE `vaitro` (
  `id_vaitro` int(11) PRIMARY KEY NOT NULL,
  `ten_vaitro` varchar(255),
  `trangthai` int DEFAULT 1
);

CREATE TABLE `Quyen` (
  `id_quyen` int(11) PRIMARY KEY NOT NULL,
  `ten_quen` varchar(255),
  `trangthai` int DEFAULT 1
);

CREATE TABLE `CTQuyen` (
  `id_vaitro` int(11) NOT NULL,
  `id_quyen` int(11) NOT NULL,
  PRIMARY KEY (`id_vaitro`, `id_quyen`)
);

ALTER TABLE `GioHang` ADD FOREIGN KEY (`id_khachhang`) REFERENCES `KhachHang` (`id_khachhang`);

ALTER TABLE `CtGioHang` ADD FOREIGN KEY (`imei`) REFERENCES `ctsanpham` (`imei`);

ALTER TABLE `CTHoaDon` ADD FOREIGN KEY (`imei`) REFERENCES `ctsanpham` (`imei`);

ALTER TABLE `PhienBanSanPham` ADD FOREIGN KEY (`id_sanpham`) REFERENCES `sanpham` (`id_sanpham`);

ALTER TABLE `ctsanpham` ADD FOREIGN KEY (`pbSanPham_id`) REFERENCES `PhienBanSanPham` (`id_phienban`);

ALTER TABLE `ctsanpham` ADD FOREIGN KEY (`phieuNhap_id`) REFERENCES `PhieuNhap` (`id_phieunhap`);

ALTER TABLE `CtPhieuNhap` ADD FOREIGN KEY (`id_phieunhap`) REFERENCES `PhieuNhap` (`id_phieunhap`);

ALTER TABLE `CtPhieuNhap` ADD FOREIGN KEY (`id_phienbansp`) REFERENCES `PhienBanSanPham` (`id_phienban`);

ALTER TABLE `PhieuNhap` ADD FOREIGN KEY (`id_nhanvien`) REFERENCES `NhanVien` (`id_nhanvien`);

ALTER TABLE `NhanVien` ADD FOREIGN KEY (`id_taikhoan`) REFERENCES `TaiKhoan` (`id_taikhoan`);

ALTER TABLE `KhachHang` ADD FOREIGN KEY (`id_taikhoan`) REFERENCES `TaiKhoan` (`id_taikhoan`);

ALTER TABLE `CtGioHang` ADD FOREIGN KEY (`id_giohang`) REFERENCES `GioHang` (`id_giohang`);

ALTER TABLE `KhachHang` ADD FOREIGN KEY (`id_khachhang`) REFERENCES `HoaDon` (`id_khachhang`);

ALTER TABLE `CTHoaDon` ADD FOREIGN KEY (`id_hoadon`) REFERENCES `HoaDon` (`id_hoadon`);

ALTER TABLE `TaiKhoan` ADD FOREIGN KEY (`vaitro_id`) REFERENCES `vaitro` (`id_vaitro`);

ALTER TABLE `CTQuyen` ADD FOREIGN KEY (`id_vaitro`) REFERENCES `vaitro` (`id_vaitro`);

ALTER TABLE `CTQuyen` ADD FOREIGN KEY (`id_quyen`) REFERENCES `Quyen` (`id_quyen`);

ALTER TABLE `sanpham` ADD FOREIGN KEY (`id_thuongthieu`) REFERENCES `Thuonghieu` (`id_thuonghieu`);

ALTER TABLE `HoaDon` ADD FOREIGN KEY (`id_trangthaiHD`) REFERENCES `TrangThaiHD` (`id_trangthaiHD`);

ALTER TABLE `PhienBanSanPham` ADD FOREIGN KEY (`id_BaoHanh`) REFERENCES `Baohanh` (`id_baohanh`);

ALTER TABLE `NhanVien` ADD FOREIGN KEY (`sodienthoai`) REFERENCES `NhanVien` (`trangthai`);

ALTER TABLE `PhieuBaoHanh` ADD FOREIGN KEY (`imei`) REFERENCES `ctsanpham` (`imei`);

ALTER TABLE `PhieuBaoHanh` ADD FOREIGN KEY (`id_hoadon`) REFERENCES `HoaDon` (`id_hoadon`);

ALTER TABLE `PhieuNhap` ADD FOREIGN KEY (`id_nhacungcap`) REFERENCES `NhaCungCap` (`id_nhacungcap`);

ALTER TABLE `img_sanpham` ADD FOREIGN KEY (`id_sanpham`) REFERENCES `sanpham` (`id_sanpham`);
