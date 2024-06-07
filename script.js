//Repræsenter selve elevatoren og døren på elevatoren
const elevator = document.getElementById('elevator');
const elevatorDoor = document.querySelector('.elevator-door');

//Dette array holder styr på hvilken højde de forskellige etager har.
const floorHeights = [0, 120, 220, 330, 440];

//Holder styr på anmodningerne fra brugeren
const floorRequests = [];
//Holder styr på elevatoren's bevægelses retning.
let direction = 1; 
//Den aktuelle position
let currentFloor = 0;
//Den ønskede etage.
let targetFloor = null;
//Indikerer om elevatoren bevæger sig.
let isMoving = false;


function toggleElevatorDoors(open) {
  elevatorDoor.style.transform = open ? 'scaleX(0)' : 'scaleX(1)';
}

class ListNode {
    constructor(floor) {
        this.floor = floor;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }
}
/*
//Metode til at tilføje en ny node i sort orden
insertSorted(floor) {
    const newNode = new ListNode(floor);
    if (!this.head) {
        this.head = this.tail = newNode;
    } else {
        let current = this.head;
        let previous = null;
        while (current && current.floor < floor) {
            previous = current;
            current = current.next;
        }
        if (!previous) {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        } else {
            newNode.next = previous.next;
            newNode.prev = previous;
            if (previous.next) previous.next.prev = newNode;
            previous.next = newNode;
            if (newNode.next == null) this.tail = newNode; // Update tail if at the end
        }
    }
}

// Metode til at fjerne en node
remove(floor) {
    let current = this.head;
    while (current) {
        if (current.floor === floor) {
            if (current.prev) current.prev.next = current.next;
            if (current.next) current.next.prev = current.prev;
            if (current === this.head) this.head = current.next;
            if (current === this.tail) this.tail = current.prev;
            return;
        }
        current = current.next;
    }
}

// Metode til at finde en node
find(floor) {
    let current = this.head;
    while (current) {
        if (current.floor === floor) {
            return true;
        }
        current = current.next;
    }
    return false;
}


function processLookRequests(elevator) {
if (!elevator.isMoving) {
    if (elevator.direction === 1) { //Opad
        let current = elevator.requests.head;
        while (current && current.floor < elevator.currentFloor) {
            current = current.next;
        }
        if (current) {
            moveToFloor(current.floor);
        } else {
            elevator.direction = -1; //Skift retning
            processLookRequests(elevator);
        }
    } else { //Nedad
        let current = elevator.requests.tail;
        while (current && current.floor > elevator.currentFloor) {
            current = current.prev;
        }
        if (current) {
            moveToFloor(current.floor);
        } else {
            elevator.direction = 1; //Skift retning
            processLookRequests(elevator);
        }
    }
}
*/


document.getElementById('algorithm').addEventListener('change', function() {
    switch (this.value) {
      case 'fcfs':
        currentAlgorithm = processFCFSRequests; //Funktionen skal defineres til FCFS
        break;
      case 'scan':
        currentAlgorithm = processNextRequest; //Scan implementering
        break;
      case 'look':
        currentAlgorithm = processLookRequests; //Look
        break;
    }
    console.log("Algoritme skiftet til:", this.value);
  });
  
  // Sikrer, at 'currentAlgorithm' bruges korrekt i anmodningshåndteringen
  function requestFloor(floor) {
    if (!floorRequests.includes(floor)) {
      floorRequests.push(floor);
      if (!isMoving) {
        currentAlgorithm();
      }
    }
  }
  

//Look Algoritmen
function processLookRequests() {
    while (!isMoving && floorRequests.length > 0) {
        const directionRequests = floorRequests.filter(r => (direction === 1 ? r > currentFloor : r < currentFloor));
        if (directionRequests.length > 0) {
            //Sorterer og vælger den nærmeste anmodning i den aktuelle retning
            directionRequests.sort((a, b) => (direction === 1 ? a - b : b - a));
            const nextFloor = directionRequests[0];
            moveToFloor(nextFloor);
        } else {
            //Skifter retning, hvis der ikke er flere anmodninger i den aktuelle retning
            direction *= -1;
        }
    }
}

function requestFloorLook(floor) {
    if (!floorRequests.includes(floor)) {
        floorRequests.push(floor);
        if (!isMoving) {
            processLookRequests();
        }
    }
}


//First Come, First Served
function processFCFSRequests() {
    if (!isMoving && floorRequests.length > 0) {
        // Tager den første anmodning fra køen
        const nextFloor = floorRequests.shift();
        moveToFloor(nextFloor);
    }
}

function requestFloorFCFS(floor) {
    floorRequests.push(floor);
    if (!isMoving) {
        processFCFSRequests();
    }
}



async function processNextRequest() {
 //Håndter anmodninger, indtil der ikke er flere tilbage eller elevatoren er i bevægelse
 while (floorRequests.length > 0 && !isMoving) {
  //Vælg den nærmeste anmodning i den aktuelle retning
  const relevantRequests = floorRequests.filter(r => (direction === 1 ? r > currentFloor : r < currentFloor));
  relevantRequests.sort((a, b) => direction === 1 ? a - b : b - a);
  
  let targetFloor = relevantRequests.length > 0 ? relevantRequests[0] : null;

  //hvis ingen relevante anmodninger, vend retning hvis der er andre anmodninger
  if (!targetFloor) {
      direction *= -1;
      //Fortsætter med næste iteration af while-løkken med ny retning
      continue;
  }

      //Start bevægelsen til den valgte etage
      moveToFloor(targetFloor);
      //Afslut løkken, da elevatoren nu er i bevægelse
      break;
  }
}


async function moveToFloor(floor) {
  try{
  isMoving = true;
  toggleElevatorDoors(true);
  const travelTime = 1000 * Math.abs(floor - currentFloor);

  elevator.style.transition = `bottom ${travelTime}ms ease-in-out`;
  elevator.style.bottom = `${floorHeights[floor]}px`;

  //Venter på at bevægelsen er færdig
  await new Promise(resolve => setTimeout(resolve, travelTime));

  //Efter bevægelsen er færdig, opdaterer status
   currentFloor = floor;
   toggleElevatorDoors(false); // Lukker dørene
   isMoving = false;
   floorRequests.splice(floorRequests.indexOf(floor), 1);
 
   //Hvis der er flere anmodninger, behandles de
   if (floorRequests.length > 0) {
     processNextRequest();
   }
 } catch (error) {
  console.error('An error occurred while moving to floor:', error);
 }
}
/*
  setTimeout(() => {
      currentFloor = floor;
      toggleElevatorDoors(false);
      isMoving = false;
      floorRequests.splice(floorRequests.indexOf(floor), 1);

      if (!isMoving && floorRequests.length > 0) {
        processNextRequest();
      }
  }, travelTime + 500);
}*/

async function requestFloor(floor) {
  if (!floorRequests.includes(floor)) {
      floorRequests.push(floor);
      if (!isMoving) {
          processNextRequest();
      }
  }
}


class Passenger {
  constructor(startFloor, targetFloor) {
    this.startFloor = startFloor;
    this.targetFloor = targetFloor;
    this.inElevator = false;
  }
}

const passengers = [];  // Array til at holde styr på alle passagererne

function addPassenger(startFloor, targetFloor) {
  const passenger = new Passenger(startFloor, targetFloor);
  passengers.push(passenger);
  //Simuler at passageren kalder elevatoren
  requestFloor(startFloor);
}

function updatePassengerMovement() {
  const passengerIcon = document.querySelector('.passenger-icon');
  passengerIcon.style.transition = 'transform 0.5s ease-in-out';
  if (passenger.inElevator) {
    passengerIcon.style.transform = 'translateX(100px)'; // Går ind i elevatoren
  } else {
    passengerIcon.style.transform = 'translateX(-100px)'; // Går ud af elevatoren
  }
}

function updatePassengers(floor, entering) {
  passengers.forEach(passenger => {
    if (passenger.startFloor === currentFloor && !passenger.inElevator) {
      passenger.inElevator = true;  // Passageren går ind i elevatoren
      console.log(`Passenger entered elevator at floor ${currentFloor}`);
      requestFloor(passenger.targetFloor);  // Request the target floor
    } else if (passenger.targetFloor === currentFloor && passenger.inElevator) {
      passenger.inElevator = false;  // Passageren forlader elevatoren
      console.log(`Passenger exited elevator at floor ${currentFloor}`);
    }
  });
}

//Flytter elevatoren til ønskede etage
function moveElevator() {
  if (!isMoving && floorRequests.length > 0) {
    let targetFloor = null;
    if (direction === 1) { //Op
        targetFloor = floorRequests.filter(floor => floor > currentFloor).sort((a, b) => a - b)[0];
    } else { //Ned
        targetFloor = floorRequests.filter(floor => floor < currentFloor).sort((a, b) => b - a)[0];
    }

    if (targetFloor !== undefined) {
        //Beregner tidsforløbet baseret på etage forskelle
        const travelTime = 1000 * Math.abs(targetFloor - currentFloor);
        elevator.style.transition = `bottom ${travelTime}ms ease-in-out`;

        isMoving = true;
        toggleElevatorDoors(true); // Åbner døren
        setTimeout(() => {
          elevator.style.bottom = `${floorHeights[currentFloor]}px`;
          //Sætter den aktuelle til at være slut etagen
          currentFloor = targetFloor;

          //Flytter elevatoren til etagen efter en forsinkelse.
          setTimeout(() => {
            updatePassengers(currentFloor, false);  
            toggleElevatorDoors(false); // Lukker døren

            setTimeout(() => {
              updatePassengers(currentFloor, true);
              isMoving = false;
              floorRequests = floorRequests.filter(request => request !== targetFloor);
              //Behandler resterende anmodninger i køen
              handleFloorRequests();
          }, 500); // Giver tid til 'dør' animation
       }, travelTime);
    }, 500);
} else {
      
    // Skift retning hvis ingen flere etager i den nuværende retning
    direction *= -1;
    handleFloorRequests();
 }
}}


function toggleElevatorDoors(open) {
  const elevatorDoor = document.querySelector('.elevator-door');
  elevatorDoor.style.transform = open ? 'scaleX(0)' : 'scaleX(1)';
}

function updateFloorIndicator() {
  const indicator = document.getElementById('floor-indicator');
  indicator.textContent = currentFloor;
  indicator.style.transition = 'color 0.5s ease-in-out';
  indicator.style.color = '#ff0000'; // Rød når den når en etage
  setTimeout(() => {
    indicator.style.color = '#000000'; // Tilbage til sort
  }, 500);
}

function flashButton(floor) {
  const button = document.getElementById(`floor${floor}`);
  button.style.transition = 'background-color 0.5s';
  button.style.backgroundColor = '#ffff00'; // Lys op
  setTimeout(() => {
    button.style.backgroundColor = ''; // Tilbage til standard
  }, 500);
}

function addWaitingPassenger(floor) {
  const floorDiv = document.querySelector(`.floor${floor}`);
  const passenger = document.createElement('div');
  passenger.className = 'waiting-passenger';
  floorDiv.appendChild(passenger);
  setTimeout(() => {
    passenger.remove(); // Fjern ventende passager når elevatoren ankommer
  }, 5000);
}

function handlePassengerMovement(floor, entering) {
  const person = document.getElementById(`person${floor}`);
  if (entering) {
    person.style.display = 'block'; //Vis personen
    person.style.transform = 'translateX(-50px)'; // Bevæg personen mod elevatoren
    setTimeout(() => {
      person.style.display = 'none'; //Skjul personen igen (gået ind i elevatoren)
    }, 1000);
  } else {
    person.style.display = 'block'; //Vis personen
    person.style.transform = 'translateX(50px)'; // Bevæg personen væk fra elevatoren
    setTimeout(() => {
      person.style.display = 'none'; //Skjul personen igen (forladt elevatoren)
    }, 1000);
  }
}


//Opdater moveElevator for at inkludere passagerbevægelser
function moveElevator() {
  if (targetFloor === null) return;
  
  isMoving = true;
  toggleElevatorDoors(true); //Åbner døren
  handlePassengerMovement(currentFloor, false); //Passagerer forlader elevatoren

  setTimeout(() => {
    elevator.style.bottom = `${floorHeights[currentFloor]}px`;
    currentFloor = targetFloor;
    handlePassengerMovement(currentFloor, true); //Passagerer går ind i elevatoren

    setTimeout(() => {
      toggleElevatorDoors(false); //Lukker døren
      isMoving = false;
      targetFloor = null;
      handleFloorRequests();
    }, 500); // Vent lidt før døren lukkes

  }, 1000 * Math.abs(targetFloor - currentFloor)); // Tid det tager at nå etagen
}



//Funktion til at håndtere anmodninger fra brugeren
function handleFloorRequests() {
  //Sorter anmodningerne i køen, i stigende eller faldende rækkefølge
  floorRequests.sort((a, b) => (direction === 1 ? a - b : b - a));

  //Afslut funktionen hvis der ikke er flere anmodninger i køen.
  if (floorRequests.length === 0) return;

  //Hent den første anmodning fra køen
  const floor = floorRequests.shift();

  //Behandl anmodningen
  requestFloor(floor);

  //Forsæt med at behandle resten af anmodningerne
  setTimeout(handleFloorRequests, 1000); //Vent 1 sekund før næste anmodning
}

//Funktion til at håndtere en etage anmodning
function requestFloor(floor) {
  //Tilføj anmodningen til køen hvis elevatoren er i bevægelse 
  //eller allerede på den ønskedet etage
  if (isMoving || floor === currentFloor) {
    floorRequests.push(floor); 
    return;
  }
  
  
  targetFloor = floor;
  moveElevator();
}

document.querySelectorAll('.add-passenger').forEach(button => {
  button.addEventListener('click', function() {
    const startFloor = parseInt(this.getAttribute('data-start'));
    // Tilføj en simpel prompt til at vælge måletage. Sikrer at måletagen ikke er startetagen.
    let targetFloor;
    do {
      targetFloor = parseInt(prompt(`Hvor skal passageren fra etage ${startFloor} hen? Indtast en måletage:`));
    } while (targetFloor === startFloor);

    addPassenger(startFloor, targetFloor);
  });
});


//Tilføjer eventListeners til knapper for hver etage
document.getElementById('floor4').addEventListener('click', function() {
  requestFloor(4);
});
document.getElementById('floor3').addEventListener('click', function() {
  requestFloor(3);
});
document.getElementById('floor2').addEventListener('click', function() {
  requestFloor(2);
});
document.getElementById('floor1').addEventListener('click', function() {
  requestFloor(1);
});
document.getElementById('floor0').addEventListener('click', function() {
  requestFloor(0);
});

