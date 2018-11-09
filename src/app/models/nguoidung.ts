export class NguoiDung {
    TaiKhoan: string;
    MatKhau: string;
    Email: string;
    SoDT: string;
    MaNhom: string;
    MaLoaiNguoiDung:string;
    HoTen: string;

    constructor(tk:string, mk:string, email:string, sdt:string, maNhom:string, maLoaiNguoiDung:string, hoTen:string){
        this.TaiKhoan = tk;
        this.MatKhau = mk;
        this.Email = email;
        this.SoDT = sdt;
        this.MaNhom = maNhom;
        this.MaLoaiNguoiDung = maLoaiNguoiDung;
        this.HoTen = hoTen;
    }
}