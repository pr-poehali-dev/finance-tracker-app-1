import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
}

interface Payment {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  type: 'recurring' | 'credit' | 'debt';
}

interface Shift {
  id: string;
  date: Date;
  hours: number;
  hourlyRate: number;
  bonus?: number;
  deductions?: number;
}

const FinanceApp: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'income', category: 'Зарплата', amount: 85000, description: 'Основная зарплата', date: new Date('2025-01-15') },
    { id: '2', type: 'expense', category: 'ЖКХ', amount: 8500, description: 'Коммунальные услуги', date: new Date('2025-01-10') },
    { id: '3', type: 'expense', category: 'Продукты', amount: 12000, description: 'Продуктовые покупки', date: new Date('2025-01-08') },
    { id: '4', type: 'income', category: 'Фриланс', amount: 25000, description: 'Дополнительный доход', date: new Date('2025-01-20') }
  ]);

  const [payments] = useState<Payment[]>([
    { id: '1', name: 'ЖКХ', amount: 8500, dueDate: new Date('2025-02-10'), status: 'pending', type: 'recurring' },
    { id: '2', name: 'Кредит банк', amount: 15000, dueDate: new Date('2025-02-05'), status: 'pending', type: 'credit' },
    { id: '3', name: 'Интернет', amount: 1200, dueDate: new Date('2025-02-01'), status: 'overdue', type: 'recurring' },
    { id: '4', name: 'Мобильная связь', amount: 800, dueDate: new Date('2025-02-03'), status: 'paid', type: 'recurring' }
  ]);

  const [shifts] = useState<Shift[]>([
    { id: '1', date: new Date('2025-01-15'), hours: 8, hourlyRate: 800, bonus: 2000 },
    { id: '2', date: new Date('2025-01-16'), hours: 8, hourlyRate: 800 },
    { id: '3', date: new Date('2025-01-17'), hours: 6, hourlyRate: 800, deductions: 300 },
    { id: '4', date: new Date('2025-01-18'), hours: 8, hourlyRate: 800, bonus: 1000 }
  ]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  
  const salaryPeriod1 = shifts.filter(s => s.date.getDate() >= 30 || s.date.getDate() <= 14);
  const salaryPeriod2 = shifts.filter(s => s.date.getDate() >= 15 && s.date.getDate() <= 29);
  
  const calculateSalary = (shifts: Shift[]) => {
    return shifts.reduce((total, shift) => {
      const base = shift.hours * shift.hourlyRate;
      const bonus = shift.bonus || 0;
      const deductions = shift.deductions || 0;
      return total + base + bonus - deductions;
    }, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success text-success-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="gradient-bg text-white p-6 card-shadow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Icon name="Wallet" size={32} />
            FinanceTracker
          </h1>
          <p className="text-blue-100 mt-2">Умный учет ваших финансов</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation */}
          <TabsList className="grid grid-cols-7 w-full bg-white card-shadow h-14">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="Home" size={18} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Зарплата
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <Icon name="TrendingUp" size={18} />
              Доходы
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Icon name="TrendingDown" size={18} />
              Расходы
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Icon name="CreditCard" size={18} />
              Платежи
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Icon name="BarChart3" size={18} />
              Отчеты
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" size={18} />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-shadow hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="ArrowUpCircle" size={18} className="text-success" />
                    Общий доход
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {totalIncome.toLocaleString('ru-RU')} ₽
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="ArrowDownCircle" size={18} className="text-destructive" />
                    Общий расход
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {totalExpenses.toLocaleString('ru-RU')} ₽
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="Wallet" size={18} className="text-primary" />
                    Баланс
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {balance.toLocaleString('ru-RU')} ₽
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="Target" size={18} className="text-warning" />
                    Цель месяца
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">75%</div>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions & Upcoming Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Activity" size={20} />
                    Последние операции
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover-lift">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                          <Icon 
                            name={transaction.type === 'income' ? 'ArrowUpCircle' : 'ArrowDownCircle'} 
                            size={16} 
                            className={transaction.type === 'income' ? 'text-success' : 'text-destructive'} 
                          />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Ближайшие платежи
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover-lift">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Icon name="CreditCard" size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.name}</p>
                          <p className="text-sm text-gray-500">
                            {payment.dueDate.toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status === 'paid' ? 'Оплачено' : 
                           payment.status === 'overdue' ? 'Просрочено' : 'Ожидает'}
                        </Badge>
                        <span className="font-bold">{payment.amount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Salary Tab */}
          <TabsContent value="salary" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    Календарь смен
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Период 1 (30-14)</CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-success">
                      {calculateSalary(salaryPeriod1).toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {salaryPeriod1.length} смен • Выплата 15 числа
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Период 2 (15-29)</CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-success">
                      {calculateSalary(salaryPeriod2).toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {salaryPeriod2.length} смен • Выплата 30 числа
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Детализация смен
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить смену
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить новую смену</DialogTitle>
                        <DialogDescription>
                          Заполните данные о рабочей смене
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Дата</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Часы</Label>
                          <Input type="number" placeholder="8" />
                        </div>
                        <div>
                          <Label>Ставка за час</Label>
                          <Input type="number" placeholder="800" />
                        </div>
                        <div>
                          <Label>Премия</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <Button className="w-full">Сохранить смену</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Часы</TableHead>
                      <TableHead>Ставка</TableHead>
                      <TableHead>Премия</TableHead>
                      <TableHead>Списания</TableHead>
                      <TableHead>Итого</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell>{shift.date.toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>{shift.hours}</TableCell>
                        <TableCell>{shift.hourlyRate} ₽</TableCell>
                        <TableCell className="text-success">
                          {shift.bonus ? `+${shift.bonus} ₽` : '—'}
                        </TableCell>
                        <TableCell className="text-destructive">
                          {shift.deductions ? `-${shift.deductions} ₽` : '—'}
                        </TableCell>
                        <TableCell className="font-bold">
                          {(shift.hours * shift.hourlyRate + (shift.bonus || 0) - (shift.deductions || 0)).toLocaleString('ru-RU')} ₽
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Tab */}
          <TabsContent value="income" className="space-y-6 animate-fade-in">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Доходы
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить доход
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить новый доход</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Категория</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="salary">Зарплата</SelectItem>
                              <SelectItem value="freelance">Фриланс</SelectItem>
                              <SelectItem value="investments">Инвестиции</SelectItem>
                              <SelectItem value="other">Другое</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Сумма</Label>
                          <Input type="number" placeholder="10000" />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Input placeholder="Описание дохода" />
                        </div>
                        <Button className="w-full">Добавить доход</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.filter(t => t.type === 'income').map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date.toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="font-bold text-success">
                          +{transaction.amount.toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Icon name="Edit" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Repeat" size={20} />
                    Постоянные платежи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'ЖКХ', amount: 8500 },
                      { name: 'Интернет', amount: 1200 },
                      { name: 'Мобильная связь', amount: 800 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
                        <span>{item.name}</span>
                        <span className="font-bold">{item.amount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="CreditCard" size={20} />
                    Кредиты и долги
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Кредит банк', amount: 15000, remaining: 24 },
                      { name: 'Рассрочка телефон', amount: 3500, remaining: 6 }
                    ].map((item, index) => (
                      <div key={index} className="p-3 rounded bg-gray-50">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="font-bold">{item.amount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Осталось: {item.remaining} месяцев
                        </div>
                        <Progress value={(24 - item.remaining) / 24 * 100} className="mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="ShoppingCart" size={20} />
                    Повседневные расходы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Продукты', amount: 12000, color: 'bg-blue-100 text-blue-800' },
                      { name: 'Транспорт', amount: 3500, color: 'bg-green-100 text-green-800' },
                      { name: 'Развлечения', amount: 5000, color: 'bg-purple-100 text-purple-800' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Badge className={item.color}>{item.name}</Badge>
                        </div>
                        <span className="font-bold">{item.amount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6 animate-fade-in">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Управление платежами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Срок оплаты</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.name}</TableCell>
                        <TableCell className="font-bold">
                          {payment.amount.toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell>{payment.dueDate.toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status === 'paid' ? 'Оплачено' : 
                             payment.status === 'overdue' ? 'Просрочено' : 'Ожидает'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.type === 'recurring' ? 'Регулярный' :
                             payment.type === 'credit' ? 'Кредит' : 'Долг'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Icon name="Check" size={16} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="PieChart" size={20} />
                    Структура расходов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'ЖКХ', amount: 8500, percentage: 35 },
                      { category: 'Продукты', amount: 12000, percentage: 50 },
                      { category: 'Транспорт', amount: 3500, percentage: 15 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{item.category}</span>
                          <span className="font-bold">{item.amount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Progress value={item.percentage} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Динамика по месяцам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Декабрь', income: 110000, expenses: 45000 },
                      { month: 'Январь', income: 110000, expenses: 52000 },
                      { month: 'Февраль', income: 115000, expenses: 48000 }
                    ].map((item, index) => (
                      <div key={index} className="p-4 rounded-lg bg-gray-50">
                        <h4 className="font-medium mb-2">{item.month}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Доходы</p>
                            <p className="font-bold text-success">+{item.income.toLocaleString('ru-RU')} ₽</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Расходы</p>
                            <p className="font-bold text-destructive">-{item.expenses.toLocaleString('ru-RU')} ₽</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="User" size={20} />
                    Профиль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Имя</Label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label>Валюта</Label>
                    <Select defaultValue="rub">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rub">Рубль (₽)</SelectItem>
                        <SelectItem value="usd">Доллар ($)</SelectItem>
                        <SelectItem value="eur">Евро (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Сохранить изменения</Button>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Bell" size={20} />
                    Уведомления
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Напоминания о платежах</Label>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Еженедельный отчет</Label>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Превышение бюджета</Label>
                    <Button variant="outline" size="sm">Отключено</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinanceApp;