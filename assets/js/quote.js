let quoteElement = document.getElementById('quote');
  fetch('https://api.api-ninjas.com/v1/quotes', {
    headers: {
      'X-Api-Key': 'q1nHH5P3TUAsaQsxt+m90g==X6Fbv3pT2zk5XN6v'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .then(data => {
    let quoteData = data[0];
    quoteElement.innerHTML = `${quoteData.quote} - ${quoteData.author}`;
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));