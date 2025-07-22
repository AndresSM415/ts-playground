import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({id: true})

const fakeExpenses: Expense[] = [
    {id: 1, title: "Groceries", amount: 150.50},
    {id: 2, title: "Internet Bill", amount: 75.00},
    {id: 3, title: "Office Supplies", amount: 45.25}
]

export const expensesRoute = new Hono()
    .get("/", async (c) => {
        return c.json({"expenses": fakeExpenses})
    })
    .post("/", zValidator('json', createPostSchema), async (c) => {
        const data: any = c.req.valid('json');
        fakeExpenses.push({id: fakeExpenses.length + 1, ...data})
        c.status(201)
        console.log(data)
        return c.json(data)
    })
    .get("/total-spent", (c) => {
        const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0)
        return c.json(total);
    })
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'))
        const expense = fakeExpenses.find(expense => expense.id === id)
        if (!expense) {
            return c.notFound()
        }
        return c.json({expense})
    })
    .delete("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const index = fakeExpenses.findIndex(expense => expense.id === id);

        if (index === -1) {
            return c.notFound();
        }

        const deletedExpense = fakeExpenses.splice(index, 1)[0];
        return c.json({expense: deletedExpense});
    });