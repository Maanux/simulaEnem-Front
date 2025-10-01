import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladoPersonalizadoComponent } from './simulado-personalizado.component';

describe('SimuladoPersonalizadoComponent', () => {
  let component: SimuladoPersonalizadoComponent;
  let fixture: ComponentFixture<SimuladoPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladoPersonalizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimuladoPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
