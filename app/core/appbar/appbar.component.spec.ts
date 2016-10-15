import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';

import { AppbarComponent } from './appbar.component';

let comp: AppbarComponent;
let fixture: ComponentFixture<AppbarComponent>;
let de: DebugElement;
let el: HTMLElement;
let de1: DebugElement;
let el1: HTMLElement;

describe('AppbarComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppbarComponent, RouterLinkStubDirective]
        })
            .compileComponents(); // compile template and css
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppbarComponent);
        comp = fixture.componentInstance; // test instance

        de = fixture.debugElement.query(By.css('.navbar-brand'));
        el = de.nativeElement;
        de1 = fixture.debugElement.query(By.css('.app-subtitle'));
        el1 = de1.nativeElement;
        fixture.detectChanges(); // trigger initial data binding
    });

    it('has an empty apptitle by default', () => {
        expect(el.textContent).toBe('');
    });

    it('shows a new apptitle after change', () => {
        let newTitle: string = 'New title';
        comp.apptitle = newTitle;
        fixture.detectChanges();
        expect(el.textContent).toBe(newTitle);
    });

    it('has an empty subtitle by default', () => {
        expect(el1.textContent).toBe('');
    });

    it('shows a new subtitle after change', () => {
        let newTitle: string = 'New subtitle';
        comp.subtitle = newTitle;
        fixture.detectChanges();
        expect(el1.textContent).toBe(newTitle);
    });

});
