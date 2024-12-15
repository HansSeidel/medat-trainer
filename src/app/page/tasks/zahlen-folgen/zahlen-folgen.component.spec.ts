import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZahlenFolgenComponent } from './zahlen-folgen.component';

describe('ZahlenFolgenComponent', () => {
  let component: ZahlenFolgenComponent;
  let fixture: ComponentFixture<ZahlenFolgenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZahlenFolgenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZahlenFolgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
