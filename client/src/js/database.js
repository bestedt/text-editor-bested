import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
// using an async function to add the content to the database
const putDb = async (content) => {
  // opening the database
  const db = await openDB('jate', 1);
  // creating a transaction to add the content to the database
  const tx = db.transaction('jate', 'readwrite');
  // adding the content to the object store
  const store = tx.objectStore('jate');
  // adding the content to the object store
  const id = await store.put({ content });
  // console logging the id of the content added
  console.log(`Added content with ID: ${id}`);

  await tx.complete; // corrected: await tx.complete instead of await tx.done
};

// TODO: Add logic for a method that gets all the content from the database
// using an async function to get the content from the database
const getDb = async () => {
  // opening the database
  const db = await openDB('jate', 1);
  // creating a transaction to get the content from the database
  const tx = db.transaction('jate', 'readonly');
  // getting the content from the object store
  const store = tx.objectStore('jate');
  // getting all the content from the object store
  const content = await store.getAll();
  console.log('All content:', content);
  // waiting for the transaction to complete
  await tx.complete; // Corrected: await tx.complete instead of await tx.done
  // returning the content
  return content;
};

initdb();
export { getDb, putDb };
