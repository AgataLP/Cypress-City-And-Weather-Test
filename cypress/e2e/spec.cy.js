function checkWeatherForCity(cityName) {
    cy.visit('https://www.bbc.co.uk/weather');
    cy.get('.ls-c-search__input').type(cityName);
    cy.get('.ls-c-locations-list-list').first().click();
    const today = new Date().getDay();
    const daysUntilSaturday = (6 - today) % 7;
    const numb = (daysUntilSaturday + 7);
    cy.get(`#daylink-${numb}`).click();
    cy.get('.wr-day-temperature__high-value').invoke('text').then(temperatureText => {
      const temperature = parseInt(temperatureText.replace('°', ''));
      cy.log(temperature);
      cy.get('.wr-day__content__weather-type-description--opaque').invoke('text').then(descriptionText => {
        const sunny = descriptionText.includes('Sunny');
        if (temperature >= 10 && sunny) {
          cy.log('this place is sunny and atleast 10%');
          cy.readFile('cypress/fixtures/sunnyPlaces.json').then((sunnyPlaces) => {
          sunnyPlaces.cities.push(cityName);
          cy.writeFile('cypress/fixtures/sunnyPlaces.json', sunnyPlaces);
        });
        // Log the selected cities to the console
        } else {
          cy.log('this place is not sunny and 10 degrees');
        }
      });
    });
  };

describe('get list of citys', () => {
    it('Get list of citys anc create file to store sunny citys', () => {
      cy.visit('https://en.wikipedia.org/wiki/List_of_cities_in_the_United_Kingdom#List_of_cities')
      const cities = [];
      cy.get('.wikitable').find('tbody > tr').each(($tr, index, $list) => {
        if (index > 0) { // Skip the first row, which contains the table header
            cities.push($tr.find('td:nth-child(1) > a:first').text()); // Extract the first <a> element inside the cell
        }
      }).then(() => {
        // Randomly select 10 cities from the list
        const randomCities = Cypress._.sampleSize(cities, 10);
        cy.writeFile('cypress/fixtures/randomCities.json', { cities: randomCities });
        // Log the selected cities to the console
        cy.log(randomCities);
        console.log(randomCities);
        const randomCity = Cypress._.sample(randomCities);
        cy.writeFile('cypress/fixtures/randomCity.json', { city: randomCity });
        cy.wait(10000)
      });
    // Create an empty list
    const sunnyPlaces = { cities: [] };
    // Write the list to a file (this will create the file if it doesn't exist)
    cy.writeFile('cypress/fixtures/sunnyPlaces.json', sunnyPlaces);
    });
});  


describe('Check all the cities and weather', () => {
    it('should be sunny and 10C or all cities checked', () => {
     cy.fixture('randomCities.json').then((data) => {
      for (let i = 0; i < data.cities.length; i++) {
      const city = data.cities[i];
      cy.log(city);
      checkWeatherForCity(city);
    }}); 
    cy.readFile('cypress/fixtures/sunnyPlaces.json').then((list) => {
        const cities = list.cities;
        if (cities.length > 0) {
            cy.log(`The first place that was found that is sunny and above 10 degrees is: ${cities[0]}`);
            // const sunnyCitiesString = cities.join(', ');
            // cy.log(`All the places that are sunny and above 10 degrees are: ${sunnyCitiesString}`);
        } else {
          cy.log('There is no sunny places');
        }
      });
   });
 });