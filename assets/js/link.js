
const addLinkButton = document.getElementById('add-link-btn');
const addLinkForm = document.getElementById('add-link-form');
const submitLinkButton = document.getElementById('submit-link-btn');
const dropdownContent = document.querySelector('.dropdown-content');

// Load links from localStorage 
document.addEventListener('DOMContentLoaded', () => {
  const savedLinks = JSON.parse(localStorage.getItem('links')) || [];
  savedLinks.forEach(linkData => {
    createLinkItem(linkData.name, linkData.url);
  });
});

// 'Add Link' button event
addLinkButton.addEventListener('click', (event) => {
  const rect = event.target.getBoundingClientRect();
  addLinkForm.style.top = `${rect.bottom + window.scrollY}px`;
  addLinkForm.style.left = `${rect.left + window.scrollX}px`;
  addLinkForm.style.display = 'block';
});

// Submit Link button event
submitLinkButton.addEventListener('click', () => {
  const linkName = document.getElementById('link-name').value.trim();
  const linkURL = document.getElementById('link-url').value.trim();

  if (linkName && linkURL) {
    // Create link item and add to dropdown
    createLinkItem(linkName, linkURL);

    //Save to localStorage
    saveLinkToLocalStorage(linkName, linkURL);

    // Clear and hide form
    document.getElementById('link-name').value = '';
    document.getElementById('link-url').value = '';
    addLinkForm.style.display = 'none';
  } else {
    alert('Please enter both a name and a URL for the link.');
  }
});

// delete button
function createLinkItem(name, url) {
  const linkItem = document.createElement('div');
  linkItem.className = 'link-item';

  const newLink = document.createElement('a');
  newLink.textContent = name;
  newLink.href = url;
  newLink.target = '_blank';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.className = 'delete-btn';
  
  // Delete link 
  deleteButton.addEventListener('click', () => {
    linkItem.remove();
    removeLinkFromLocalStorage(name, url);
  });

  linkItem.appendChild(newLink);
  linkItem.appendChild(deleteButton);
  dropdownContent.appendChild(linkItem);
}

// Save a new link to localStorage
function saveLinkToLocalStorage(name, url) {
  const links = JSON.parse(localStorage.getItem('links')) || [];
  links.push({ name, url });
  localStorage.setItem('links', JSON.stringify(links));
}

//remove a link from localStorage
function removeLinkFromLocalStorage(name, url) {
  const links = JSON.parse(localStorage.getItem('links')) || [];
  
  const updatedLinks = links.filter(link => !(link.name === name && link.url === url));
  localStorage.setItem('links', JSON.stringify(updatedLinks));
}

//hide the form 
document.addEventListener('click', (event) => {
    if (!addLinkForm.contains(event.target) && !addLinkButton.contains(event.target)) {
        addLinkForm.style.display = 'none';
    }
});