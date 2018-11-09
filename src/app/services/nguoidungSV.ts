import { NguoiDung } from './../models/nguoidung';
import * as $ from 'jquery';
export class NguoiDungSV {
    DangKy(nguoiDung: NguoiDung) {
        return $.ajax({
            type: 'POST',
            url: 'http://sv2.myclass.vn/api/QuanLyNguoiDung/ThemNguoiDung',
            data: nguoiDung,
            ContentType: 'application/json'
        });
    }
    DangNhap(tk, mk) {
        return $.ajax({
            type: 'POST',
            url: `http://sv2.myclass.vn/api/QuanLyNguoiDung/DangNhap?taikhoan=${tk}&matkhau=${mk}`,
            dataType: 'JSON'
        });
    }
}