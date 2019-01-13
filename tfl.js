function search(nameKey, myArray){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].key === nameKey) {
          return myArray[i].value;
      }
  }
}

function getTerminalData(tfl_response){
  var response = JSON.parse(tfl_response);
  var data = {};
  data.terminal_name = response.commonName;
  data.id = response.id;
  data.lat = response.lat;
  data.lon = response.lon;
  data.maps = `https://www.google.com/maps/@${data.lat},${data.lon},18z`
  data.nb_bikes = search("NbBikes", response.additionalProperties);
  data.nb_empty_docks = search("NbEmptyDocks", response.additionalProperties);
  data.nb_docks = search("NbDocks", response.additionalProperties);
  data.locked = search("Locked", response.additionalProperties);
  data.last_updated = response.additionalProperties[0].modified;
  data.terminal_used = Number(data.nb_bikes)*100/Number(data.nb_docks);
  return data;
}

function getProgressBar(terminal_data){
  var bar_color = "";
  if(Number(terminal_data.nb_bikes) < 4){
    bar_color = "bg-danger";
  } else if(Number(terminal_data.nb_bikes) < 6){
    bar_color = "bg-warning";
  } else {
    bar_color = "bg-success";
  }

  const progress = document.createElement('div');
  progress.setAttribute('class', 'progress');
  const progress_bar = document.createElement('div');
  progress_bar.setAttribute('class', `progress-bar ${bar_color}`);
  progress_bar.setAttribute('role', 'progressbar');
  progress_bar.setAttribute('style', `width: ${terminal_data.terminal_used}%`);
  progress_bar.setAttribute('aria-valuenow', `${terminal_data.nb_bikes}`);
  progress_bar.setAttribute('aria-valuemin', '0');
  progress_bar.setAttribute('aria-valuemin', `${terminal_data.nb_docks}`);
  progress_bar.textContent = `${terminal_data.nb_bikes}`;
  progress.appendChild(progress_bar);
  return progress;
}

function getCardImg(terminal_data){
  card_img = document.createElement('img');
  card_img.setAttribute('src', `img/${terminal_data.id}.png`);
  card_img.setAttribute('class', 'card-img-top');
  card_img.setAttribute('alt', '...');
  return card_img;
}

function getMapsLink(terminal_data){
  maps_card_body = document.createElement('div');
  maps_card_body.setAttribute('class', 'card-body');
  card_maps_link = document.createElement('a');
  card_maps_link.setAttribute('class', 'card-link');
  card_maps_link.setAttribute('href', `${terminal_data.maps}`);
  card_maps_link.textContent = "Maps";
  maps_card_body.appendChild(card_maps_link);
  return maps_card_body;
}

function getCardTitle(terminal_data){
  const card_title = document.createElement('h5');
  card_title.setAttribute('class', 'card-title');
  card_title.textContent = terminal_data.terminal_name;
  return card_title;
}

function getLastUpdated(terminal_data){
  last_updated = document.createElement('li');
  last_updated.setAttribute('class', 'list-group-item');
  last_updated.textContent = terminal_data.last_updated;
  return last_updated;
}

function getLocked(terminal_data){
  locked = document.createElement('li');
  locked.setAttribute('class', 'list-group-item');
  locked.textContent = `Locked: ${terminal_data.locked}`;
  return locked;
}

function getCardList(){
  card_list = document.createElement('ul');
  card_list.setAttribute('class', 'list-group list-group-flush');
  return card_list;
}

function getCardBody(){
  card_body = document.createElement('div');
  card_body.setAttribute('class', 'card-body');
  return card_body;
}

function getCard(){
  card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.setAttribute('style', 'width: 18rem;');
  return card;
}

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);
row = document.createElement('div');
row.setAttribute('class', 'row');
container.appendChild(row);
window.onload = function(){
  var f = (function(){
    var xhr = [], i;
    var terminals = ["BikePoints_307","BikePoints_584","BikePoints_261","BikePoints_163","BikePoints_209"]
    var terminalsLength = terminals.length;
    for(i = 0; i < terminalsLength; i++){
      (function(i){
        xhr[i] = new XMLHttpRequest();
        url = "https://api.tfl.gov.uk/BikePoint/" + terminals[i];
        xhr[i].open("GET", url, true);
        xhr[i].onreadystatechange = function(){
          if (xhr[i].readyState === 4 && xhr[i].status === 200){
            var terminal_data = getTerminalData(xhr[i].responseText)
            // Generate Card Image
            card_img = getCardImg(terminal_data);
            // Generate Progress Bar object
            progress_bar = getProgressBar(terminal_data);
            // Generate Card Title
            card_title = getCardTitle(terminal_data);
            // Generate Date Info LI
            last_updated = getLastUpdated(terminal_data);
            // Generate Locked Info LI
            locked = getLocked(terminal_data);
            // Generate List UL
            card_list = getCardList();
            card_list.appendChild(last_updated);
            card_list.appendChild(locked);
            // Generate Card Body
            card_body = getCardBody();
            // Add Title and Progress Bar to Card Body
            card_body.appendChild(card_img);
            card_body.appendChild(card_title);
            card_body.appendChild(progress_bar);
            // Generate Card Maps Link
            card_maps_link = getMapsLink(terminal_data);
            // Generate Main Card
            card = getCard();
            // Add Card Body to Main Card
            card.appendChild(card_body);
            // Add List UL to Main Card
            card.appendChild(card_list);
            card.appendChild(card_maps_link);
            card_wrapper = document.createElement('div');
            card_wrapper.setAttribute('class', 'col-sm-4');
            card_wrapper.appendChild(card);
            row.appendChild(card_wrapper);
          }
        };
        xhr[i].send();
      })(i);
    }
  })();
};
