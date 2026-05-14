import { User } from "../types/User";

// Simulated user database
export const usersList: User[] = [
  {
    id: "u1",
    name: "João Silva",
    email: "joao@email.com",
    password: "123456",
    role: "customer",
    phone: "(11) 99999-0001",
    address: "Rua das Flores, 123 - São Paulo, SP",
  },
  {
    id: "u2",
    name: "Maria Souza",
    email: "maria@email.com",
    password: "123456",
    role: "customer",
    phone: "(11) 99999-0002",
    address: "Av. Paulista, 456 - São Paulo, SP",
  },
  {
    id: "admin",
    name: "SnapBite Admin",
    email: "admin@snapbite.com",
    password: "admin123",
    role: "admin",
    phone: "(11) 3000-0000",
    address: "Rua do Estabelecimento, 1 - São Paulo, SP",
  },
];
