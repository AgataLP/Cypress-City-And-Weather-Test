const cityName = 'London';
const cityName2 = 'Liverpool';
const cityName3 = 'Manchester';


describe('checking weather', () => {
    it('goes to bbc weather and check different cities weather', () => {
        cy.visit('https://www.bbc.com/weather')
        cy.get('.ls-c-search__input').type(cityName)
        cy.get('.ls-c-locations-list-list').first().click();
        cy.get('.wr-day__content__weather-type-description--opaque').should('contain', 'Thundery showers and light winds')
        cy.get('.ls-c-search__input').type(cityName2)
        cy.get('.ls-c-locations-list-list').first().click();
        cy.get('.wr-day__content__weather-type-description--opaque').should('contain', 'Sunny and a moderate breeze')
        cy.get('.ls-c-search__input').type(cityName3)
        cy.get('.ls-c-locations-list-list').first().click();
        cy.get('.wr-day__content__weather-type-description--opaque').should('contain', 'Light rain and a moderate breeze')
        
        })
    })
