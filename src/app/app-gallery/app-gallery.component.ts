import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { environment } from '../environment';
import { url } from 'inspector';





@Component({
  selector: 'app-app-gallery',
  templateUrl: './app-gallery.component.html',

  styleUrls: ['./app-gallery.component.scss']
})
export class AppGalleryComponent implements OnInit,OnDestroy  {
modalRef?: BsModalRef;
  selectedItem?: any;
    galleryImages:any =[];
    currentIndex = 0;
    animationClass = '';
     autoSlideInterval: any;
  autoSlideDelay = environment.SlideSecondsConunt; // 4 seconds

  @ViewChild('mainVideo') mainVideoRef!: ElementRef<HTMLVideoElement>;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    dots: true,
    arrows: true,
    infinite: true,
  };
  constructor(private modalService: BsModalService,private http: HttpClient) {


   }

  ngAfterViewInit(): void {



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
  this.startAutoSlide();
  let NoOfImage =  environment.No_Of_Images
     this.loadGalleryFiles(NoOfImage);

  }

    ngOnDestroy(): void {
    this.stopAutoSlide();
  }
  async loadGalleryFiles(NoOfImage: number): Promise<void> {
  const results: { url: string; type: string }[] = [];

  for (let i = 1; i <= NoOfImage; i++) {
    let fileExt = 'jpg';
    let fileUrl = `assets/${i}.${fileExt}`;

    const imageExists = await this.fileExists(fileUrl);

    if (imageExists) {
      results.push({
        url: fileUrl,
        type: this.getMediaType(fileUrl)
      });
    } else {
      // Try mp4 next
      fileExt = 'mp4';
      fileUrl = `assets/${i}.${fileExt}`;
      const videoExists = await this.fileExists(fileUrl);

      if (videoExists) {
        results.push({
          url: fileUrl,
          type: 'video'
        });
      }
    }
  }

  this.galleryImages = results;
   this.selectMedia(this.galleryImages[this.currentIndex], this.currentIndex);
  console.log('Gallery Loaded:', this.galleryImages);
}

  nextMedia() {
    const nextIndex = (this.currentIndex + 1) % this.galleryImages.length;
    this.selectMedia(this.galleryImages[nextIndex], nextIndex, 'next');
  }

  prevMedia() {
    const prevIndex =
      (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.selectMedia(this.galleryImages[prevIndex], prevIndex, 'prev');
  }


onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  console.log('Image load error for URL:', imgElement.src);
  imgElement.src = ''; // your default fallback image
}


    openModal(template: TemplateRef<any>, image: any) {
     // console.log(image)
    this.selectedItem = image;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModal() {
    this.modalRef?.hide();
  }

   async fileExists(url: string): Promise<boolean> {
   try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
  }

   stopAllVideos() {
    const videos = document.querySelectorAll<HTMLVideoElement>('video');
    videos.forEach(v => v.pause());
  }
//  selectMedia(item: any, index: number) {
//     this.stopAllVideos();
//     this.currentIndex = index;
//     this.selectedItem = item;

//     // Auto-play video if selected
//     if (item.type === 'video') {
//       setTimeout(() => {
//         const videoEl = this.mainVideoRef?.nativeElement;
//         if (videoEl) {
//           videoEl.muted = true;
//           videoEl.play().catch(() => console.log('Autoplay prevented'));
//         }
//       }, 100);
//     }
//   }
  selectMedia(item: any, index: number, direction: 'next' | 'prev' = 'next') {
    this.stopAllVideos();
    this.animationClass = direction === 'next' ? 'slide-left' : 'slide-right';

    setTimeout(() => {
      this.currentIndex = index;
      this.selectedItem = item;

      // Auto-play if video
      if (item.type === 'video') {
        setTimeout(() => {
          const videoEl = this.mainVideoRef?.nativeElement;
          if (videoEl) {
            videoEl.muted = true;
            videoEl.play().catch(() => console.log('Autoplay prevented'));
          }
        }, 150);
      }

      // Reset animation
      setTimeout(() => (this.animationClass = ''), 400);
    }, 50);
  }


    startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      // only auto-slide if current item is not a playing video
      const videoEl = this.mainVideoRef?.nativeElement;
      if (this.selectedItem.type === 'video' && videoEl && !videoEl.paused) return;
      this.nextMedia();
    }, this.autoSlideDelay);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}
