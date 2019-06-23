import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Song, SongSheet} from "../../service/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/internal/operators";
import { Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SongService } from 'src/app/service/song/song.service';
import { SetPlayList, SetSongList, SetCurrentIndex } from 'src/app/store/actions/player.actions';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  arr = Array(5).fill(3);
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(private route: ActivatedRoute, private SongServe: SongService, private multipleReducerServe: MultipleReducersService) {
     this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
    });
  }

  ngOnInit() {
  }
  
  onChangeSlide(type) {
    this.nzCarousel[type]();
  }
  nzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  testMeta() {
    // this.store$.dispatch(metaReducers[0](playerReducer));
  }
  
  
  playSong(id: number) {
    // this.store$.dispatch(SelectPlay({ id }));
    this.SongServe.getSongList(id).subscribe(list => {
      this.multipleReducerServe.selectPlay(({ list, index: 0 }));
    });
  }
  
  
  trackByBanners(index: number, banner: Banner): number { return banner.targetId; }
  trackByHotTags(index: number, tag: HotTag): number { return tag.id; }
  trackBySongList(index: number, song: Song): number { return song.id; }
}
