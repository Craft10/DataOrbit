import * as fs from 'fs';

type DataType = 'Text' | 'Number' | 'Path'; // Definir más tipos si es necesario

interface TableSchema {
    [key: string]: DataType;
}

interface BackupConfig {
    interval: number;
}

interface DataOrbitConfig {
    file: string;
    encryptionKey: string;
    tables: {
        [tableName: string]: TableSchema;
    };
    backups: BackupConfig[];
}

class DataOrbit {
  private config: DataOrbitConfig;
  private data: any;
  private primaryKeyMap: { [tableName: string]: number };
  private uniqueKeyMap: { [tableName: string]: { [columnName: string]: Set<any> } };

    constructor(config: DataOrbitConfig) {
        this.config = config;
        this.data = {};
        this.primaryKeyMap = {};
        this.uniqueKeyMap = {};
      
        this.loadDatabase();
    }
  
  private loadDatabase() {
      try {
          const rawData = fs.readFileSync(this.config.file, 'utf8');
          if (rawData.trim() !== '') {
              const decryptedData = this.decryptData(rawData, this.config.encryptionKey);
              this.data = JSON.parse(decryptedData);
          } else {
              console.log('El archivo JSON está vacío.');
          }
      } catch (error) {
          console.error('Error loading database:', error);
      }
  }

    private saveDatabase() {
        try {
            const encryptedData = this.encryptData(JSON.stringify(this.data, null, 4), this.config.encryptionKey);
            fs.writeFileSync(this.config.file, encryptedData);
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    private encryptData(data: string, encryptionKey: string): string {
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length));
        }
        return encrypted;
    }

    private decryptData(data: string, encryptionKey: string): string {
        return this.encryptData(data, encryptionKey);
    }

    public insert(tableName: string, data: any) {
        if (!this.data[tableName]) {
            this.data[tableName] = [];
        }

      const primaryKey = this.config.tables[tableName].primaryKey || 'id';
        if (!data[primaryKey]) {
            
            data[primaryKey] = this.getNextPrimaryKey(tableName);

          if (!this.checkUniqueConstraints(tableName, data)) {
            console.error('Error: Unique constraint violation.');
            return;
          }
          
        this.data[tableName].push(data);
        this.saveDatabase();
    }
    }
  
    public delete(tableName: string, primaryKey: string) {
        if (this.data[tableName]) {
            this.data[tableName] = this.data[tableName].filter((item: any) => item[primaryKey] !== data[primaryKey]);
            this.saveDatabase();
        }
    }

    public editInfo(tableName: string, primaryKey: string, newData: any) {
        if (this.data[tableName]) {
            this.data[tableName] = this.data[tableName].map((item: any) => {
                if (item[primaryKey] === newData[primaryKey]) {
                    return { ...item, ...newData };
                }
                return item;
            });
            this.saveDatabase();
        }
    }

    public createTable(tableName: string, schema: TableSchema) {
        if (!this.data[tableName]) {
            this.data[tableName] = [];
            this.saveDatabase();
        }
    }

    public dropTable(tableName: string) {
        delete this.data[tableName];
        this.saveDatabase();
    }

    private backup() {
        const now = new Date();
        const backupFolder = `${this.config.file}_backups`;
        if (!fs.existsSync(backupFolder)) {
            fs.mkdirSync(backupFolder);
        }
        const backupFilePath = `${backupFolder}/${now.getTime()}_backup.json`;
        fs.copyFileSync(this.config.file, backupFilePath);
    }

    public startBackupService() {
        this.config.backups.forEach((backupConfig) => {
            setInterval(() => {
                this.backup();
            }, backupConfig.interval * 24 * 60 * 60 * 1000); 
        });
    }
  public getAllRows(tableName: string): any[] {
        if (this.data[tableName]) {
            return this.data[tableName];
        }
        return [];
    }

    public getAllColumns(tableName: string, columnName: string): any[] {
        if (this.data[tableName]) {
            return this.data[tableName].map((row: any) => row[columnName]);
        }
        return [];
    }

    public getRow(tableName: string, primaryKey: string, value: any): any | null {
        if (this.data[tableName]) {
            return this.data[tableName].find((row: any) => row[primaryKey] === value) || null;
        }
        return null;
    }

    public getColumn(tableName: string, primaryKey: string): any[] {
        if (this.data[tableName]) {
            return this.data[tableName].map((row: any) => row[primaryKey]);
        }
        return [];
    }

  private getNextPrimaryKey(tableName: string): number {
        if (!this.primaryKeyMap[tableName]) {
            this.primaryKeyMap[tableName] = 1;
        } else {
            this.primaryKeyMap[tableName]++;
        }
        return this.primaryKeyMap[tableName];
  }

  private checkUniqueConstraints(tableName: string, data: any): boolean {
        const uniqueConstraints = this.config.tables[tableName].unique || [];
        for (const uniqueKey of uniqueConstraints) {
            if (this.uniqueKeyMap[tableName][uniqueKey].has(data[uniqueKey])) {
                return false;
            }
        }
        return true;
    }

    private updateUniqueKeyMap(tableName: string, data: any) {
        const uniqueConstraints = this.config.tables[tableName].unique || [];
        for (const uniqueKey of uniqueConstraints) {
            if (!this.uniqueKeyMap[tableName]) {
                this.uniqueKeyMap[tableName] = {};
            }
            if (!this.uniqueKeyMap[tableName][uniqueKey]) {
                this.uniqueKeyMap[tableName][uniqueKey] = new Set();
            }
            this.uniqueKeyMap[tableName][uniqueKey].add(data[uniqueKey]);
        }
    }
}

export default DataOrbit;