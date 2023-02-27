// This function checks the weather for a given city
function checkWeatherForCity(cityName) {
    // Visit the BBC weather website
    cy.visit('https://www.bbc.co.uk/weather');
    // Enter the city name in the search bar
    cy.get('.ls-c-search__input').type(cityName);
    // Click the first result in the locations list
    cy.get('.ls-c-locations-list-list').first().click();
    // Calculate the number of days until the next Saturday
    const today = new Date().getDay();
    const daysUntilSaturday = (6 - today) % 7;
    const numb = (daysUntilSaturday + 7);
    // Click on the forecast for that day
    cy.get(`#daylink-${numb}`).click();
    cy.get('.wr-day-temperature__high-value').invoke('text').then(temperatureText => {
      const temperature = parseInt(temperatureText.replace('°', ''));
      // Log the temperature to the console
      cy.log(temperature);
      // Get the weather description for the day
      cy.get('.wr-day__content__weather-type-description--opaque').invoke('text').then(descriptionText => {
        // Check if the weather is sunny
        const sunny = descriptionText.includes('Sunny');
        if (temperature >= 10 && sunny) {
          // If it's sunny and at least 10 degrees, add the city to the list of sunny places
          cy.log('this place is sunny and atleast 10%');
          cy.readFile('cypress/fixtures/sunnyPlaces.json').then((sunnyPlaces) => {
          sunnyPlaces.cities.push(cityName);
          cy.writeFile('cypress/fixtures/sunnyPlaces.json', sunnyPlaces);
        });
        // If it's not sunny and at least 10 degrees, log a message to the console
        } else {
          cy.log('this place is not sunny and 10 degrees');
        }
      });
    });
  };
 // From a Wikipedia list, selects 10 random cities and save them into a file
describe('get list of citys', () => {
    it('Get list of citys anc create file to store sunny citys', () => {
      cy.visit('https://en.wikipedia.org/wiki/List_of_cities_in_the_United_Kingdom#List_of_cities')
       // Create an empty list to hold the city names
      const cities = [];
      // Iterate over the rows in the table and extract the city names
      cy.get('.wikitable').find('tbody > tr').each(($tr, index, $list) => {
        if (index > 0) { // Skip the first row, which contains the table header
            cities.push($tr.find('td:nth-child(1) > a:first').text());  
        }
      }).then(() => {
        // Randomly select 10 cities from the list
        const randomCities = Cypress._.sampleSize(cities, 10);
        // Save the list of cities to a file
        cy.writeFile('cypress/fixtures/randomCities.json', { cities: randomCities });
        // Log the selected cities to the console
        cy.log(randomCities);
        console.log(randomCities);
        // Select a random city from the list and save it to a file
        const randomCity = Cypress._.sample(randomCities);
        cy.writeFile('cypress/fixtures/randomCity.json', { city: randomCity });
        cy.wait(10000)
      });
    // Create an empty list
    const sunnyPlaces = { cities: [] };
    // Sunny places will be in this file
    cy.writeFile('cypress/fixtures/sunnyPlaces.json', sunnyPlaces);
    });
});  

// This is a test case for checking weather for all cities listed in randomCities.json file.
describe('Check all the cities and weather', () => {
    it('should be sunny and 10C or all cities checked', () => {
     // This is to get the list of cities from randomCities.json file.
      cy.fixture('randomCities.json').then((data) => {
      // Loop through each city in the list.
      for (let i = 0; i < data.cities.length; i++) {
      const city = data.cities[i];
      cy.log(city);
      // Calling the function here
      checkWeatherForCity(city);
    }}); 
    // This is to read the list of sunny places from sunnyPlaces.json file.
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