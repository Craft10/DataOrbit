---

# DataOrbit

DataOrbit es una biblioteca para gestionar bases de datos JSON de forma intuitiva y eficiente en TypeScript. Permite la creación, modificación, eliminación y consulta de datos utilizando un archivo JSON como almacenamiento persistente.

## Instalación

Para instalar DataOrbit, puedes utilizar npm. Ejecuta el siguiente comando en tu terminal:

```bash
npm install dataorbit
```

## Uso básico

### Configuración inicial

Antes de usar DataOrbit, necesitas configurar tu base de datos. Aquí tienes un ejemplo de configuración básica:

```typescript
import DataOrbit, { DataOrbitConfig } from 'dataorbit';

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
        { interval: 5 }, 
    ],
};

const database = new DataOrbit(config);
```

### Operaciones básicas

Una vez configurada la base de datos, puedes realizar operaciones básicas como insertar, eliminar, modificar y consultar datos. Aquí tienes algunos ejemplos:

```typescript
// Insertar un nuevo usuario
database.insert('users', { id: '1', name: 'John Doe', age: 30 });

// Eliminar un producto
database.delete('products', 'id', '1');

// Modificar la información de un usuario
database.editInfo('users', 'id', '1', { age: 31 });

// Obtener información de un usuario específico
const specificUser = database.getRow('users', 'id', '1');

// Obtener todos los IDs de usuarios
const allUserIds = database.getColumn('users', 'id');
```

### Backup automático

DataOrbit ofrece la posibilidad de realizar copias de seguridad automáticas de tu base de datos. Esto se configura durante la inicialización de la base de datos y se ejecuta periódicamente según el intervalo especificado.

```typescript
database.startBackupService();
```

## Métodos disponibles

DataOrbit proporciona varios métodos para interactuar con la base de datos. Aquí tienes una lista de los principales métodos disponibles:

- `insert(tableName: string, data: any)`: Inserta un nuevo registro en la tabla especificada.
- `delete(tableName: string, primaryKey: string, value: any)`: Elimina un registro de la tabla especificada utilizando la clave primaria.
- `editInfo(tableName: string, primaryKey: string, value: any, newData: any)`: Modifica la información de un registro existente en la tabla especificada.
- `getRow(tableName: string, primaryKey: string, value: any): any`: Obtiene un registro específico de la tabla especificada utilizando la clave primaria.
- `getColumn(tableName: string, columnName: string): any[]`: Obtiene todos los valores de una columna específica de la tabla especificada.
- `createTable(tableName: string, schema: TableSchema)`: Crea una nueva tabla con el esquema especificado.
- `dropTable(tableName: string)`: Elimina una tabla existente.

## Conclusión

DataOrbit es una biblioteca simple pero poderosa para gestionar bases de datos JSON en TypeScript. Con su fácil configuración y su amplia gama de funciones, es ideal para proyectos pequeños y medianos que requieran una solución de almacenamiento de datos flexible y eficiente.

---

Puedes adaptar esta documentación según tus necesidades específicas y añadir más detalles y ejemplos según sea necesario.