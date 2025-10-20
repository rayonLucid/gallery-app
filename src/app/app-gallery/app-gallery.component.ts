import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swiper,{ Autoplay, Navigation, Pagination } from 'swiper';
import { environment } from '../environment';



@Component({
  selector: 'app-app-gallery',
  templateUrl: './app-gallery.component.html',

  styleUrls: ['./app-gallery.component.scss']
})
export class AppGalleryComponent implements OnInit,AfterViewInit  {
modalRef?: BsModalRef;
  selectedImage?: any;
    galleryImages:any;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    dots: true,
    arrows: true,
    infinite: true,
  };
  constructor(private modalService: BsModalService,private http: HttpClient) { }
  ngAfterViewInit(): void {
       // Initialize Swiper after view load
    Swiper.use([Navigation, Pagination, Autoplay]);
    new Swiper('.myGallery', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  ngOnInit(): void {
  let NoOfImage =  environment.No_Of_Images
   this.galleryImages = Array.from({ length: NoOfImage }, (_, i) => ({
  url: `assets/${i + 1}.jpg`,
  caption: `Image ${i + 1}`
}));
//console.log(this.galleryImages);
  }

onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = ''; // your default fallback image
}


    openModal(template: TemplateRef<any>, image: any) {
    this.selectedImage = image;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModal() {
    this.modalRef?.hide();
  }

}
