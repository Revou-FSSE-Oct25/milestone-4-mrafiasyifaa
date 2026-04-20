import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminPassword = await bcrypt.hash('admin1234', 10);
    const customerPassword = await bcrypt.hash('customer1234', 10);

    const admin = await prisma.user.create({
        data: { name: 'Admin Revobank', email: 'admin@revobank.com', password: adminPassword, role: 'ADMIN' },
    });

    const alice = await prisma.user.create({
        data: { name: 'Alice', email: 'alice@revobank.com', password: customerPassword, role: 'CUSTOMER' },
    });

    const bob = await prisma.user.create({
        data: { name: 'Bob', email: 'bob@revobank.com', password: customerPassword, role: 'CUSTOMER' },
    });

    const aliceSavings = await prisma.account.create({
        data: { userId: alice.id, accountNumber: '11111111', name: 'Alice Savings', type: 'SAVINGS', balance: 10000000 },
    });

    const aliceChecking = await prisma.account.create({
        data: { userId: alice.id, accountNumber: '11111112', name: 'Alice Checking', type: 'CHECKING', balance: 5000000 },
    });

    const bobSavings = await prisma.account.create({
        data: { userId: bob.id, accountNumber: '22222221', name: 'Bob Savings', type: 'SAVINGS', balance: 8000000 },
    });

    // Initial deposits
    await prisma.transaction.create({
        data: { receiverAccountId: aliceSavings.id, amount: 10000000, type: 'DEPOSIT', description: 'Initial deposit' },
    });
    await prisma.transaction.create({
        data: { receiverAccountId: aliceChecking.id, amount: 5000000, type: 'DEPOSIT', description: 'Initial deposit' },
    });
    await prisma.transaction.create({
        data: { receiverAccountId: bobSavings.id, amount: 8000000, type: 'DEPOSIT', description: 'Initial deposit' },
    });

    // Alice transactions
    await prisma.transaction.create({
        data: { senderAccountId: aliceSavings.id, amount: 500000, type: 'WITHDRAWAL', description: 'ATM withdrawal' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: aliceSavings.id, amount: 250000, type: 'PURCHASE', description: 'Groceries' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: aliceSavings.id, amount: 150000, type: 'PURCHASE', description: 'Online shopping' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: aliceSavings.id, receiverAccountId: aliceChecking.id, amount: 1000000, type: 'TRANSFER', description: 'Transfer to checking' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: aliceSavings.id, receiverAccountId: bobSavings.id, amount: 300000, type: 'TRANSFER', description: 'Transfer to Bob' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: aliceChecking.id, amount: 75000, type: 'PURCHASE', description: 'Coffee subscription' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: aliceChecking.id, amount: 2000000, type: 'WITHDRAWAL', description: 'Rent payment' },
    });

    // Bob transactions
    await prisma.transaction.create({
        data: { senderAccountId: bobSavings.id, amount: 400000, type: 'WITHDRAWAL', description: 'ATM withdrawal' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: bobSavings.id, amount: 180000, type: 'PURCHASE', description: 'Restaurant' },
    });
    await prisma.transaction.create({
        data: { senderAccountId: bobSavings.id, receiverAccountId: aliceSavings.id, amount: 500000, type: 'TRANSFER', description: 'Repay Alice' },
    });

    console.log('Seed complete!');
    console.log('Admin   — email: admin@revobank.com   | password: admin1234');
    console.log('Alice   — email: alice@revobank.com   | password: customer1234');
    console.log('Bob     — email: bob@revobank.com     | password: customer1234');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
