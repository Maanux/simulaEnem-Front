import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoDeSimuladosComponent } from './historico-de-simulados.component';

describe('HistoricoDeSimuladosComponent', () => {
  let component: HistoricoDeSimuladosComponent;
  let fixture: ComponentFixture<HistoricoDeSimuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoDeSimuladosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoDeSimuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
