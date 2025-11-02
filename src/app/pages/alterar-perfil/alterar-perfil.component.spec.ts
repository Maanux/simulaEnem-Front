import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarPerfilComponent } from './alterar-perfil.component';

describe('AlterarPerfilComponent', () => {
  let component: AlterarPerfilComponent;
  let fixture: ComponentFixture<AlterarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterarPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
