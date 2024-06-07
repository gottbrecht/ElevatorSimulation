# Elevator Simulation 
GitHub Pages: https://gottbrecht.github.io/ElevatorSimulation/
![Screenshot (154)](https://github.com/gottbrecht/ElevatorSimulation/assets/113165807/0d2500db-3748-42a8-a189-f85da5e77f18)

# Kort beskrivelse

Brugeren vælger mellem tre algoritmer: SCAN, Look og First Come, First Served. Efter valgt algoritme, trykker man på en vilkårlig etage og elevator simulationen optræder derefter. Man kan vælge at tilføje passagerer, og elevatordøren vil åbne og lukke, alt efter om elevatoren er i bevægelse, eller ej.

# ElevatorSimulation
#SCAN Algoritme(elevatoralgoritmen): Elevatoren fortsætter i samme retning, indtil den ikke har flere anmodninger i den retning, og derefter skifter retning, hvis der er anmodninger i den modsatte retning.

Request Handling: Håndteres i en kø-struktur 'floorRequests', hvor nye anmodninger føjes til og håndteres sekventielt. 

Move to Floor: Funktionen 'moveToFloor styrer den faktiske bevægelse til den anmodede etage og opdaterer elevatorens position efter afslutningen af rejsetiden

#While Loop: I stedet for at kalde processNextRequest() rekursivt, bruger vi en while-løkke til kontinuerligt at evaluere og håndtere anmodninger. Løkken fortsætter, så længe der ikke er nogen bevægelse (!isMoving) og der er anmodninger i køen (floorRequests.length > 0).

Den iterative tilgang forbedrer håndteringen af anmodninger ved at sikre, at logikken er robust og kan håndterer ændringer i retning mere effektivt, uden risiko for at løbe ind i problemer med rekursionsdybde. Dette gør også koden mere læsbar og lettere at vedligeholde. 

# First Come, First Served 
føjer anmodninger til en kø og håndterer dem én efter én, uanset elevatorens nuværende position. Det er den enkleste metode, men kan være ineffektiv, hvis der er mange anmodninger spredt over forskellige etager.

# Look-algoritmen 
er anset for at være mere sofistikeret, da den kræver beslutninger, baseret på elevatorens retning og de tilbageværende anmodniner i den retning
