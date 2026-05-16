import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class ReportsService {
  async getDashboardStats(userId: string) {
    const totalInvoices = await prisma.invoice.aggregate({
      where: { userId },
      _sum: { total: true },
      _count: { id: true },
    });

    const totalPayments = await prisma.payment.aggregate({
      where: { userId },
      _sum: { amount: true },
      _count: { id: true },
    });

    const totalExpenses = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
      _count: { id: true },
    });

    const customersCount = await prisma.customer.count({ where: { userId } });
    const unpaidInvoices = await prisma.invoice.count({ where: { userId, status: { in: ['SENT', 'OVERDUE'] } } });

    return {
      totalRevenue: totalInvoices._sum.total || 0,
      totalInvoices: totalInvoices._count.id || 0,
      totalPayments: totalPayments._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      customersCount,
      unpaidInvoices,
      netIncome: (totalPayments._sum.amount || 0) - (totalExpenses._sum.amount || 0),
    };
  }

  async getTrialBalance(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      include: {
        debitLines: true,
        creditLines: true,
      },
    });

    return accounts.map(acc => {
      const totalDebit = acc.debitLines.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = acc.creditLines.reduce((sum, l) => sum + l.credit, 0);
      return {
        id: acc.id,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit,
      };
    });
  }

  async getProfitAndLoss(userId: string) {
    const revenueAccounts = await prisma.account.findMany({
      where: { userId, type: 'REVENUE' },
      include: { debitLines: true, creditLines: true },
    });
    const expenseAccounts = await prisma.account.findMany({
      where: { userId, type: 'EXPENSE' },
      include: { debitLines: true, creditLines: true },
    });

    const revenue = revenueAccounts.reduce((sum, acc) => {
      return sum + acc.creditLines.reduce((s, l) => s + l.credit, 0) - acc.debitLines.reduce((s, l) => s + l.debit, 0);
    }, 0);

    const expenses = expenseAccounts.reduce((sum, acc) => {
      return sum + acc.debitLines.reduce((s, l) => s + l.debit, 0) - acc.creditLines.reduce((s, l) => s + l.credit, 0);
    }, 0);

    return {
      revenue,
      expenses,
      netProfit: revenue - expenses,
    };
  }
}
