import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swiper,{ Autoplay, Navigation, Pagination } from 'swiper';
import { environment } from '../environment';
import { url } from 'inspector';
import swiper from 'swiper';




@Component({
  selector: 'app-app-gallery',
  templateUrl: './app-gallery.component.html',

  styleUrls: ['./app-gallery.component.scss']
})
export class AppGalleryComponent implements OnInit,AfterViewInit  {
modalRef?: BsModalRef;
  selectedImage?: any;
    galleryImages:any =[];

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
       on: {
        slideChange: function () {
          // Pause any video that’s not in the active slide
          document.querySelectorAll<HTMLVideoElement>('.swiper-slide video').forEach(v => { v.pause(); });
             const activeVideo = document.querySelector<HTMLVideoElement>('.swiper-slide-active video');
              if (activeVideo) {
          //  swiper.autoplay.stop();
            activeVideo.muted = true;
            activeVideo.play();
         //   activeVideo.onended = () => swiper.autoplay.start();
          } else {
          //  swiper.autoplay.start();
          }
        }
      }
    });

      const videos = document.querySelectorAll<HTMLVideoElement>('.swiper-slide video');
    videos.forEach(video => {
      video.addEventListener('play', () => {
     //   swiper..stop();
      });
      video.addEventListener('pause', () => {
     //   swiper.autoplay.start();
      });
      video.addEventListener('ended', () => {
     //   swiper.autoplay.start();
      });
    });

  }
getMediaType(url: string): 'image' | 'video' | 'unknown' {
  const extension = url.split('.').pop()?.toLowerCase();

  if (!extension) return 'unknown';

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

  if (imageExts.includes(extension)) return 'image';
  if (videoExts.includes(extension)) return 'video';

  return 'unknown';
}

  ngOnInit(): void {

  let NoOfImage =  environment.No_Of_Images


 Array.from({ length: NoOfImage }, async (_, i) => {
  const fileName = `${i + 1}`;
  let fileExt = 'jpg'; // or dynamic if needed
  let ftype = this.getMediaType(`${fileName}.${fileExt}`);
  let fileUrl = `assets/${fileName}.${fileExt}`;
  let ImageExist =await this.fileExists(fileUrl)

if(!ImageExist){


  //try video files
  fileExt = 'mp4';
  fileUrl = `assets/${fileName}.${fileExt}`;

  ImageExist =await this.fileExists(fileUrl)
  if(ImageExist){
    this.galleryImages.push({
      url: fileUrl,
      type: 'video'
    });
  }
}else{
this.galleryImages.push({
    url: fileUrl,
    type: ftype
  });
}
//console.log(this.galleryImages);
});

  }

onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  console.log('Image load error for URL:', imgElement.src);
  imgElement.src = 'asseets/11.mp4'; // your default fallback image
}


    openModal(template: TemplateRef<any>, image: any) {
     // console.log(image)
    this.selectedImage = image;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModal() {
    this.modalRef?.hide();
  }

   fileExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('HEAD', url, true);
      xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 400);
      xhr.onerror = () => resolve(false);
      xhr.send();
    });
  }

}
