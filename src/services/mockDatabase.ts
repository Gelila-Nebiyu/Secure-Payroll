

import { User, Resource, UserRole, Department, SensitivityLevel, AccessRequest } from '../types';
import { hashPassword } from './cryptoService';

/**
 * BROWSER-BASED MONGODB IMPLEMENTATION
 * 
 * In a real production environment, this class would connect to a real MongoDB instance
 * via an API (e.g., MongoDB Atlas Data API) using fetch().
 * 
 * For this standalone application, we persist data to LocalStorage but expose
 * a standard MongoDB Driver API (find, findOne, insertOne, updateOne).
 */

const DB_NAME = 'sentinel_mongodb_v1';

// Seed Admin
const createMockAuth = (password: string) => {
  const salt = "static_salt_for_demo";
  return {
    passwordHash: hashPassword(password, salt),
    salt: salt
  };
};

const SEED_ADMIN: User = {
  _id: 'admin_001',
  name: 'System Administrator',
  email: 'admin@sentinel.com',
  role: UserRole.ADMIN,
  department: Department.IT,
  clearanceLevel: SensitivityLevel.TOP_SECRET,
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff',
  ipAddress: '127.0.0.1',
  ...createMockAuth("admin123"),
  failedLoginAttempts: 0,
  lockoutUntil: null,
  mfaEnabled: true,
  lastPasswordChange: new Date().toISOString(),
  isVerified: true,
  createdAt: new Date().toISOString()
};

const SEED_RESOURCES: Resource[] = [
  {
    _id: 'res_seed_001',
    name: 'Executive Payroll - Q1 2024',
    type: 'PAYROLL_RECORD',
    content: 'Payroll distribution for executive board members. Includes quarterly bonuses.',
    ownerId: 'admin_001',
    sensitivityLevel: SensitivityLevel.TOP_SECRET,
    department: Department.EXECUTIVE,
    accessControlList: ['admin_001'],
    baseSalary: 150000,
    tax: 45000,
    deductions: 5000,
    netPay: 100000,
    status: 'PAID',
    dateCreated: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    _id: 'res_seed_002',
    name: 'IT Dept Salaries - March',
    type: 'PAYROLL_RECORD',
    content: 'Standard monthly payroll for IT department staff.',
    ownerId: 'admin_001',
    sensitivityLevel: SensitivityLevel.CONFIDENTIAL,
    department: Department.IT,
    accessControlList: ['admin_001'],
    baseSalary: 85000,
    tax: 21000,
    deductions: 2000,
    netPay: 62000,
    status: 'PENDING',
    dateCreated: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'res_seed_003',
    name: 'Q2 Budget Forecast',
    type: 'SYSTEM_CONFIG',
    content: 'Preliminary budget allocation for Q2 resources and hiring.',
    ownerId: 'admin_001',
    sensitivityLevel: SensitivityLevel.INTERNAL,
    department: Department.FINANCE,
    accessControlList: ['admin_001'],
    dateCreated: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'res_seed_004',
    name: 'Employee Handbook 2024',
    type: 'SYSTEM_CONFIG',
    content: 'Updated policies regarding remote work and benefits.',
    ownerId: 'admin_001',
    sensitivityLevel: SensitivityLevel.PUBLIC,
    department: Department.HR,
    accessControlList: [],
    dateCreated: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    _id: 'res_seed_005',
    name: 'Sales Commission Report',
    type: 'PAYROLL_RECORD',
    content: 'Commission breakdown for the sales team regarding the Alpha Project.',
    ownerId: 'admin_001',
    sensitivityLevel: SensitivityLevel.CONFIDENTIAL,
    department: Department.SALES,
    accessControlList: ['admin_001'],
    baseSalary: 12000,
    tax: 3000,
    deductions: 500,
    netPay: 8500,
    status: 'DRAFT',
    dateCreated: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

class MongoCollection<T> {
  constructor(private collectionName: string, private db: BrowserMongoDB) {}

  private async load(): Promise<T[]> {
    const key = `${DB_NAME}_${this.collectionName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private async save(data: T[]): Promise<void> {
    const key = `${DB_NAME}_${this.collectionName}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // MongoDB: db.collection.find({ query })
  async find(query: Partial<T> = {}): Promise<T[]> {
    const items = await this.load();
    return items.filter(item => {
      return Object.entries(query).every(([key, value]) => (item as any)[key] === value);
    });
  }

  // MongoDB: db.collection.findOne({ query })
  async findOne(query: Partial<T>): Promise<T | null> {
    const items = await this.load();
    const item = items.find(item => {
      return Object.entries(query).every(([key, value]) => (item as any)[key] === value);
    });
    return item || null;
  }

  // MongoDB: db.collection.insertOne(doc)
  async insertOne(doc: T): Promise<T> {
    const items = await this.load();
    items.push(doc);
    await this.save(items);
    return doc;
  }

  // MongoDB: db.collection.updateOne({ query }, { $set: update })
  async updateOne(query: Partial<T>, updateData: Partial<T>): Promise<T | null> {
    const items = await this.load();
    const index = items.findIndex(item => {
      return Object.entries(query).every(([key, value]) => (item as any)[key] === value);
    });

    if (index !== -1) {
      items[index] = { ...items[index], ...updateData };
      await this.save(items);
      return items[index];
    }
    return null;
  }

  // MongoDB: db.collection.deleteOne({ query })
  async deleteOne(query: Partial<T>): Promise<boolean> {
    const items = await this.load();
    const index = items.findIndex(item => {
      return Object.entries(query).every(([key, value]) => (item as any)[key] === value);
    });

    if (index !== -1) {
      items.splice(index, 1);
      await this.save(items);
      return true;
    }
    return false;
  }
}

class BrowserMongoDB {
  users: MongoCollection<User>;
  resources: MongoCollection<Resource>;
  requests: MongoCollection<AccessRequest>;

  constructor() {
    this.users = new MongoCollection<User>('users', this);
    this.resources = new MongoCollection<Resource>('resources', this);
    this.requests = new MongoCollection<AccessRequest>('requests', this);
    this.init();
  }

  async init() {
    // Check if admin exists, if not seed
    const admin = await this.users.findOne({ email: SEED_ADMIN.email });
    if (!admin) {
      console.log("Creating default Admin user in MongoDB...");
      await this.users.insertOne(SEED_ADMIN);
    }

    // Check if resources exist, if not seed
    const resources = await this.resources.find({});
    if (resources.length === 0) {
      console.log("Seeding default Resources in MongoDB...");
      for (const res of SEED_RESOURCES) {
        await this.resources.insertOne(res);
      }
    }
  }
}

export const mongo = new BrowserMongoDB();