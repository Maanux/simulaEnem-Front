import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoProvaComponent } from './resultado-prova.component';

describe('ResultadoProvaComponent', () => {
  let component: ResultadoProvaComponent;
  let fixture: ComponentFixture<ResultadoProvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoProvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoProvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
