# DT208G - Projekt

Projektet skapades med [Angular CLI](https://github.com/angular/angular-cli) version 18.2.6.

## Grundkrav

+ Applikationen skall skapas med Angular och TypeScript.
+ Lösningen skall ha minst två undersidor, en för att söka och visa information om kurser - och en som visar skapat ramschema.
+ Komponenter och routing skalla användas.
+ Minst två stycken services skall skapas, en för kursdata och en för hantering av ramschema.
+ Skapat ramschema skall lagras med hjälp av localStorage, och läsas in vid inladdning av webbsidan.
+ Webbplatsen skall vara snygg och prydlig och fungera väl på stora som små skärmar med bra responsiv design.
+ Källkodens skall versionshanteras med Git.
+ Den färdiga lösning skall publiceras till publikt tillgänglig webbhost.

### Krav för kurser

+ Kunna sortera data på kurskod, kursnamn, poäng, ämne.
+ Att filtrera data på kurskod och kursnamn.
+ Att välja ut kurser från ämne - exempelvis; bara visa kurser som tillhör ämnet "Datateknik"
+ Lägga till kurser till eget ramschema.
+ Se antal kurser i aktuell sökning, exempelvis alla kurser, eller antal kurser i valt urval (ex hur många kurser det blir om enbart "Datateknik"-kurser visas.

### Krav för ramschema

+ Se valda kurser till ramschemat (dessa ska lagras i localStorage).
+ Se antal sammanlagda högskolepoäng för de valda kurserna.
+ Att kunna plocka bort kurser från ramschemat.

## Lösningsbeskrivning

Projektet finns publikt tillgängligt på följande [adress](https://dalu2301-dt208g-projekt.netlify.app/)

Alla grundkrav är uppfyllda, och en enklare variant av paginering är implementerad som 
ett alternativ till en klassisk sidpaginering, det vill säga att en typ av "läs in fler rader" 
är implementerad.

I övrigt så består lösningen av fem stycken komponenter, fyra stycken tjänster och två stycken interface. 
De flesta grundläggande tekniker, såsom klasser, Directives, Interpolation, Event Binding, Attribute Binding och 
Dependency Injection är tillämpade.

