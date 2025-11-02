import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladoAleatorioComponent } from './simulado-aleatorio.component';

describe('SimuladoAleatorioComponent', () => {
  let component: SimuladoAleatorioComponent;
  let fixture: ComponentFixture<SimuladoAleatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladoAleatorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimuladoAleatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
