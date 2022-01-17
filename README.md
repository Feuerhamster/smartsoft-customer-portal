# SmartSoft Customer Portal
**This is a school assignment that I have to do as part of my IT training at vocational school.**

## 📺 Demo
So you don't have to install the project yourself, here is a hosted demo:  
https://smartsoft-customer-portal.hamsterlabs.de/

**E-Mail:** admin@host.local  
**Password:** 40c279

## 📦 TechStack
- Typescript
- Express.js
- [Overnight.js](https://github.com/seanpmaxwell/overnight/) (Express Typescript decorators)
- [Prisma ORM](https://www.prisma.io/)
- [Typedi](https://github.com/typestack/typedi) dependency injection

## 📁 Project structure
- `/src/controllers` Overnight.js controller classes for the express.js endpoints
- `/src/services` Services that contains the business logic (also classes with dependency injection)
- `/src/middlewares` Express.js Middlewares
- `/src/models` Contains Typescript types & classes and the data transfer objects
- `/prisma` Prisma ORM schemas
- `/views` Pug.js template views for the web frontend
- `/public` Assets for the web frontend

## ⚙ Run the project
**Requirements:**
- [Node.js LTS](https://nodejs.org/en/)
- A MySQL Database

1. Download the project files and extract them
2. Create a `.env` file with the following fields:
```env
DATABASE_URL= mysql://user:password@localhost/database 
JWT_SECRET = a_random_secure_secret
```
3. Run `npm install`
4. Run `npx prisma generate`
5. Run `npx prisma migrate dev` if youre developing, Run `npx prisma migrate deploy` if youre deploying.
6. Run `npm start`

*\*Finished\**

You can then access the project at `http://localhost:3000`.  
A default user will be generated and the login credentials are printed to the console output.

## 📃 The original school task (german language)
```
Firma
Smartsoft
Abteilung FI
Lübeck

Sehr geehrte Damen und Herren,
zur Pflege unserer Privatkunden benötigen wir ein
Online-Portal. Die Kunden sollen darin administrativ von
einem unserer Mitarbeiter mit der von uns bereits
vergebenen 12-stelligen Kundennummer eingepflegt
und verwaltet werden. Aus Datenschutzgründen sollen
im Portal außer der Kundennummer nur ein
Benutzername und unser Tarifmodell (Basis, Medium
oder Premium) und der Name ihres zuständigen
Ansprechpartners in unserem Hause vermerkt sein.
Zudem soll die Kunden die Möglichkeit haben,
Nachrichten im Portal für ihren Ansprechpartner, also
Nachrichten mit optionalem Betreff und Datum, zu
hinterlassen.
Unsere Mitarbeiter sollen diese Nachrichten online
ansehen können.
Bitte realisieren Sie eine Lösung nach diesen Vorgaben.
Das Portal soll bis zum 23.11.2021 einsatzbereit sein.

Mit freundlichen Grüßen,
N. Zähler
```
