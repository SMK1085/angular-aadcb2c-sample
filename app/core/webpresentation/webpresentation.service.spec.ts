import { WebPresentation } from './webpresentation.service';

describe('WebPresentation without TestBed', () => {
    let service: WebPresentation;

    it('returns an empty Subtitle by default', () => {
        service = new WebPresentation(new TitleStub());
        expect(service.Subtitle).toBe('');
    });

    it('returns the new Subtitle after it is set', () => {
        let newTitle = 'test title';
        service = new WebPresentation(new TitleStub());
        service.changeTitle(newTitle);
        expect(service.Subtitle).toBe(newTitle);
    });

    it('updates the window title', () => {
        let newTitle = 'test title';
        let appTitle = 'Test App';
        let titleService = new TitleStub();
        service = new WebPresentation(titleService);
        service.setPageTitle(appTitle);
        service.changeTitle(newTitle);
        expect(titleService.getTitle()).toBe(newTitle + ' | ' + appTitle);
    });
});


class TitleStub {

    private title: string = '';

    public setTitle(title: string) {
        this.title = title;
    }

    public getTitle(): string {
        return this.title;
    }

}