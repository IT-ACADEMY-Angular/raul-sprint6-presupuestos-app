import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget.service';
import { FormBuilder } from '@angular/forms';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, BudgetService],
    });
    service = TestBed.inject(BudgetService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializarse con valores "1" predeterminados en el formulario', () => {
    const formValues = service.pagesAndLanguagesForm.value;
    expect(formValues.numPages).toBe(1);
    expect(formValues.numLanguages).toBe(1);
  });

  it('debería calcular el precio adicional correctamente', () => {
    const additionalPrice = service['calculateAdditionalPrice'](3, 2);
    expect(additionalPrice).toEqual(150);
  });

  it('debería evitar disminuir el número de páginas por debajo de 1', () => {
    service.pagesAndLanguagesForm.get('numPages')?.setValue(1);
    service.decrementPages();
    expect(service.pagesAndLanguagesForm.get('numPages')?.value).toEqual(1);
  });

  it('debería permitir incrementar el número de páginas correctamente', () => {
    service.pagesAndLanguagesForm.get('numPages')?.setValue(2);
    service.incrementPages();
    expect(service.pagesAndLanguagesForm.get('numPages')?.value).toEqual(3);
  });

  it('debería evitar disminuir el número de idiomas por debajo de 1', () => {
    service.pagesAndLanguagesForm.get('numLanguages')?.setValue(1);
    service.decrementLanguages();
    expect(service.pagesAndLanguagesForm.get('numLanguages')?.value).toEqual(1);
  });

  it('debería permitir incrementar el número de idiomas correctamente', () => {
    service.pagesAndLanguagesForm.get('numLanguages')?.setValue(2);
    service.incrementLanguages();
    expect(service.pagesAndLanguagesForm.get('numLanguages')?.value).toEqual(3);
  });

  it('debería actualizar el precio total correctamente', () => {
    service['basePrice'] = 100;
    const additionalPrice = 90;
    service['updateTotalPrice'](service['basePrice'], additionalPrice);
    service.selectedPrices$.subscribe((totalPrice) => {
      expect(totalPrice).toEqual(190);
    });
  });
});
