import express from 'express';
import DataOrbit, { DataOrbitConfig } from './DataOrbit';

const config: DataOrbitConfig = {
    file: './database.json',
    encryptionKey: 'mySecretKey',
    tables: {
        users: {
            id: 'Text',
            name: 'Text',
            age: 'Number',
        },
        products: {
            id: 'Text',
            name: 'Text',
            price: 'Number',
        },
    },
    backups: [
        { interval: 1 }, 
    ],
};

const database = new DataOrbit(config);

database.insert('users', { id: '1', name: 'John Doe', age: 30 });
database.insert('products', { id: '1', name: 'Product A', price: 10.99 });

database.startBackupService();

const specificUser = database.getRow('users', 'id', '1');
console.log('Specific User:', specificUser);

const allUserNames= database.getColumn('users', 'name');
const app = express();

app.get('/', (req, res) => {
  res.send('All Users Names:' + JSON.stringify(allUserNames));
});

app.listen(() => {
  console.log('Server started');
});
