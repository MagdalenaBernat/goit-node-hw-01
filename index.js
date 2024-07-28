// const {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact
// } = require('./contacts');

"use strict"

const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    console.log(contacts);
    return contacts;
  } catch (err) {
    console.error(err.message);
  }
}

async function getContactById(id) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.find(contact => contact.id === id);
    console.log(contact);
    return contact;
  } catch (err) {
    console.error(err.message);
  }
}

async function removeContact(id) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const newContacts = contacts.filter(contact => contact.id !== id);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    console.log(`Contact with id ${id} has been removed.`);
  } catch (err) {
    console.error(err.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(`Contact with name ${name} has been added.`);
    return newContact;
  } catch (err) {
    console.error(err.message);
  }
}


const { Command } = require("commander");
const program = new Command();

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      await listContacts();
      break;

    case "get":
      if (!id) {
        console.warn("\x1B[31m Please provide an id!");
        break;
      }
      await getContactById(id);
      break;

    case "add":
      if (!name || !email || !phone) {
        console.warn("\x1B[31m Please provide name, email and phone!");
        break;
      }
      await addContact(name, email, phone);
      break;

    case "remove":
      if (!id) {
        console.warn("\x1B[31m Please provide an id!");
        break;
      }
      await removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);