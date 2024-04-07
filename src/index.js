// Your code here
[http://localhost:3000](http://localhost:3000).
// Make a GET request to the endpoint
fetch('/films/1')
  .then(response => response.json()) // Parse the response as JSON
  .then(data => {
    // Display the data in the HTML container
    document.getElementById('poster').src = data.poster;
    document.getElementById('title').textContent = data.title;
    document.getElementById('runtime').textContent = data.runtime;
    document.getElementById('showtime').textContent = data.showtime;

    // Calculate and display the number of available tickets
    const availableTickets = data.capacity - data.tickets_sold;
    document.getElementById('available-tickets').textContent = availableTickets;
  })
  .catch(error => console.error('Error:', error)); // Log any errors

  // Make a GET request to the endpoint
fetch('/films')
.then(response => response.json()) // Parse the response as JSON
.then(data => {
   // Remove the placeholder li element (if it exists)
   const placeholder = document.getElementById('films').firstChild;
   if (placeholder && placeholder.tagName.toLowerCase() === 'li') {
     placeholder.remove();
   }

   // Display the movie list in the HTML container
   const filmsList = document.getElementById('films');
   data.forEach(film => {
     const filmItem = document.createElement('li');
     filmItem.classList.add('film', 'item');
     filmItem.textContent = film.title;
     filmsList.appendChild(filmItem);
   });
 })
.catch(error => console.error('Error:', error)); // Log any errors

// Add an event listener to each "Buy Ticket" button
document.querySelectorAll('.buy-ticket-btn').forEach(button => {
    button.addEventListener('click', () => {
      const filmId = button.dataset.filmId;
      const ticketsToBuy = 1; // Set the number of tickets to buy
  
      // Make a GET request to get the current number of tickets sold
      fetch(`/films/${filmId}`)
        .then(response => response.json())
        .then(data => {
          const currentTicketsSold = data.tickets_sold;
          const newTicketsSold = currentTicketsSold + ticketsToBuy;
  
          // Check if there are available tickets
          if (newTicketsSold <= data.capacity) {
            // Make a PATCH request to update the number of tickets sold
            fetch(`/films/${filmId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ tickets_sold: newTicketsSold })
            })
              .then(response => response.json())
              .then(updatedData => {
                // Make a POST request to create a new ticket
                fetch('/tickets', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ film_id: filmId, number_of_tickets: ticketsToBuy })
                })
                  .then(response => response.json())
                  .then(createdTicket => {
                    console.log('Ticket created:', createdTicket);
                    // Update the available tickets on the frontend
                    const availableTicketsSpan = document.getElementById(`available-tickets-${filmId}`);
                    availableTicketsSpan.textContent = `${updatedData.capacity - newTicketsSold} tickets available`;
                  })
                  .catch(error => console.error('Error:', error));
              })
              .catch(error => console.error('Error:', error));
          } else {
            alert('This showing is sold out. No more tickets are available.');
          }
        })
        .catch(error => console.error('Error:', error));
    });
  });

  // Add an event listener to each "Delete" button
document.querySelectorAll('.delete-film-btn').forEach(button => {
    button.addEventListener('click', () => {
      const filmId = button.dataset.filmId;
  
      // Make a DELETE request to delete the film
      fetch(`/films/${filmId}`, { method: 'DELETE' })
       .then(response => {
          // Remove the film from the list on the frontend
          const filmItem = button.closest('li');
          filmItem.remove();
        })
       .catch(error => console.error('Error:', error));
    });
  });

