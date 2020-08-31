"use strict";

const apiKey = "Goc3DcYDJubPmzgCIHAUAFibev24LxWvhsXAfaXk";

const searchUrl = "https://developer.nps.gov/api/v1/parks";
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  //iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    //for each park in the items array, add a list item to the results list
    //with  the park full name, description, and url
    $("#results-list").append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>${responseJson.data[i].url}</p></a>
        </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

function getParks(query, maxResults) {
  const params = {
    api_key: apiKey,
    // parkCode: query,
    stateCode: query,
    maxResults,
  };
  const stateParksQuery = query.reduce(
    (finalQuery, park) => finalQuery + "statePark=" + park + "&",
    ""
  );
  const queryString = formatQueryParams(params);
  const url = searchUrl + "?" + stateParksQuery + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val().trim().split(",");
    const maxResults = $("#js-max-results").val();
    getParks(searchTerm, maxResults);
  });
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  watchForm();
});
