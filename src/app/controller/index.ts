import { NguoiDung } from './../models/nguoidung';
import { Phim } from './../models/phim';
import '../../assets/css/index.css';
import { PhimSV } from '../services/phimSV';
import { NguoiDungSV } from '../services/nguoidungSV';
import swal from 'sweetalert2';
import * as $ from 'jquery';

const phimSV = new PhimSV();
const maNhom = 'GP01';
const maLoaiNguoiDung = 'khachHang';
let danhSachPhim: Phim[] = [];
let danhSachGioHang: Array<Phim> = [];
const nguoiDungSV = new NguoiDungSV();

window.onload = function () {
    phimSV.layDanhSachPhim().done(function (res) {
        danhSachPhim = res;
        renderMovieItem();
        console.log(res);
    }).fail(function (err) {
        console.log(err);
    });

    let userAcc = JSON.parse(localStorage.getItem('curUser'));
    if(userAcc !== null){
        (<HTMLSpanElement>document.getElementById('user-acc')).innerHTML = `Xin chào ${userAcc.TaiKhoan} !`;
    }

    document.getElementById('btnDangKy').addEventListener('click', dangKy);
    document.getElementById('btnDangNhap').addEventListener('click', dangNhap);
}

let renderMovieItem = () => {
    let content: string = '';
    for (let phim of danhSachPhim) {
        // destructering
        let { MaPhim, TenPhim, Trailer, HinhAnh, MoTa, MaNhom, NgayKhoiChieu, DanhGia } = phim;
        content += `
                    <div class="col-sm-6 col-md-3 text-center">
                        <div class="movie__item">
                            <img src="${phim.HinhAnh}" onerror = "this.onerror === null; this.src='https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/377848/377848._SX1280_QL80_TTD_.jpg'" style="height: 377px" class="img-fluid w-100">
                            <div class="movie__overlay"></div>
                            <div class="movie__detail w-100 text-center text-white">
                                <i class="fa fa-play d-block mx-auto mb-3 video-playvenobox  vbox-item" href="https://youtu.be/aOXvyd9v1cg"
                                    data-vbtype="video"></i>
                                    <a href="#" class="movie__icon"><i class="fa fa-ticket"></i></a>
                                    <a
                                        data-maphim = ${MaPhim}
                                        data-tenphim = ${TenPhim}
                                        data-trailer = ${Trailer}
                                        data-hinhanh = ${HinhAnh}
                                        data-mota = ${MoTa}
                                        data-manhom = ${MaNhom}
                                        data-ngaychieu = ${NgayKhoiChieu}
                                        data-manhom = ${DanhGia}
                                        class="movie__icon btn-add-to-cart"><i class="fa fa-shopping-cart"></i>
                                    </a>
                                    <br/>
                                <span>Released: ${phim.NgayKhoiChieu ? phim.NgayKhoiChieu.substr(0, 10) : '2018-11-06'}</span>
                            </div>
                        </div>
                        <p class="movie__name text-center my-3">${phim.TenPhim}</p>
                        ${renderStar(parseInt(phim.DanhGia))}
                    </div>
                    `;
    }
    (<HTMLDivElement>document.getElementById('movieList')).innerHTML = content;

    addFilmToCart('btn-add-to-cart');
};

let renderStar = (rated: number) => {
    let stars = '';
    if (!rated) {
        rated = 5;
    }
    for (let i = 0; i < rated; i++) {
        stars += `
        <i class="fa fa-star movie__star"></i>
        `;
    }
    for (let k = 5; k > rated; k--) {
        stars += `
        <i class="fa fa-star-o movie__star"></i>
        `;
    }
    return stars;
}

let addFilmToCart = (btnClass) => {
    let btnAddMovies: any = (<HTMLCollection>document.getElementsByClassName(btnClass));
    for (let btnAdd of btnAddMovies) {
        btnAdd.addEventListener('click', () => {
            let maPhim = btnAdd.getAttribute('data-maphim');
            let tenPhim = btnAdd.getAttribute('data-tenphim');
            let trailer = btnAdd.getAttribute('data-trailer');
            let hinhAnh = btnAdd.getAttribute('data-hinhanh');
            let moTa = btnAdd.getAttribute('data-mota');
            let maNhom = btnAdd.getAttribute('data-manhom');
            let ngayChieu = btnAdd.getAttribute('data-ngaychieu');
            let danhGia = btnAdd.getAttribute('data-danhgia');

            let phimItem = new Phim(maPhim, tenPhim, trailer, hinhAnh, moTa, maNhom, ngayChieu, danhGia);

            // Kiểm tra tồn tại của phim trong giỏ hàng
            let index = timPhimTheoMa(phimItem.MaPhim);
            if (index === -1) {
                // Spread operator
                danhSachGioHang = [...danhSachGioHang, phimItem];
            }

            localStorage.setItem('cartList', JSON.stringify(danhSachGioHang));

            (<HTMLSpanElement>document.getElementById('totalAmount')).innerHTML = danhSachGioHang.length.toString();
        });
    }
}

let timPhimTheoMa = (maPhim: string) => {
    for (let phim of danhSachGioHang) {
        if (phim.MaPhim === maPhim) {
            return 1;
        }
    }
    return -1;
}

// Đăng ký người dùng mới
let dangKy = () => {
    let taiKhoan = (<HTMLInputElement>document.getElementById('taiKhoan')).value;
    let matKhau = (<HTMLInputElement>document.getElementById('matKhau')).value;
    let hoTen = (<HTMLInputElement>document.getElementById('hoTen')).value;
    let email = (<HTMLInputElement>document.getElementById('email')).value;
    let soDT = (<HTMLInputElement>document.getElementById('soDT')).value;

    let newInfo = new NguoiDung(taiKhoan, matKhau, email, soDT, maNhom, maLoaiNguoiDung, hoTen);

    let ajaxTaoNguoiDung = nguoiDungSV.DangKy(newInfo);

    ajaxTaoNguoiDung.done(function () {
        swal({
            position: 'top-end',
            type: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
        });
        $('.close').trigger('click');
    }).fail(function (err) {
        console.log(err);
    });
}

// Đăng nhập

let dangNhap = () => {

    let tk = (<HTMLInputElement>document.getElementById('dn-taiKhoan')).value;
    let mk = (<HTMLInputElement>document.getElementById('dn-matKhau')).value;

    nguoiDungSV.DangNhap(tk, mk).done(rest => {
        if (typeof (rest) !== 'string') {
            swal({
                type: 'success',
                title: 'Đăng nhập thành công',
                showConfirmButton: false,
                timer: 1500
            });
            (<HTMLSpanElement>document.getElementById('user-acc')).innerHTML = `Xin chào ${rest.TaiKhoan}!`;
            localStorage.setItem('curUser', JSON.stringify(rest));
        }
        else {
            swal({
                type: 'error',
                title: 'Oops...',
                text: 'Tên người dùng hoặc mật khẩu không đúng!'
            })
        }
        $('.close').trigger('click');
    }).fail(err => {
        console.log(err);
    });
}


// -----------------ex-------------

// let hocSinh = {
//     hoTen: 'AAAAA',
//     hienThiHoTen: () =>{
//         console.log(this.hoTen);
//     },
//     hienThiHoTen2: function(){
//         console.log(this.hoTen);
//     }
// }
// hocSinh.hienThiHoTen();
// hocSinh.hienThiHoTen2();