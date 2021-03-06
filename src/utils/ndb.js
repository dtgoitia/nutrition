import axios from 'axios';

const getNutritentsByNdbno = (apiKey, ndbno) => {
  // apiKey: API key
  // ndbno:  NDB food number
  // More NDB API info: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
  

  const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno='+ndbno+'&type=b&format=json&api_key='+apiKey;
  axios.get(url)
  .then(res => {
    const food = res.data.report.food;
    console.log('food:', food);
    // this.setState({ posts });
  });
}

const getIngredientNdbno = (apiKey, searchKeyWords, callbackFunction) => {
  // apiKey: API key
  // searchKeyWords: terms requested and used in the search
  //   More NDB API info: https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md
  // callbackFunction: function to be called when response received

  if (searchKeyWords === '') {
    alert('Write some words for me to search, I can\'t read your mind!')
  } else {
    const url = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+searchKeyWords+'&sort=r&max=25&offset=0&api_key='+apiKey;
    axios.get(url)
    .then(res => {
      // If the response object contains a .data.lis member, call
      // callbackFunction with its content.
      if (res.data.list) {
        const resultList = res.data.list.item;
        callbackFunction(resultList); 
      } else if (res.data.errors){
        // If the response object contains a .data.errors member,
        // print the errors in console.
        res.data.errors.error.map( errorObject => {
          // console.info('NDB API response:', errorObject.message);
          return null
        });
      } else {
        console.log('"list" or "errors" members not found in NDB API response. See getIngredientNdbno() declaration for further detail');
      }
    });
  }
}

const ndb = {
  getNutritentsByNdbno: getNutritentsByNdbno,
  getIngredientNdbno: getIngredientNdbno
}

module.exports = ndb;