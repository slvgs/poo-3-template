import express, { Request, Response } from 'express'
import cors from 'cors'
import { AccountDB, UserDB } from './types'
import { Account } from './models/Account'
import { AccountDatabase } from './database/AccountDatabase'
import { userController } from './controller/UserController'
import { ControleDaConta } from './controller/AccountController'



const app = express()

const userControler = new userController()
const AccountController = new  ControleDaConta()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/users", userControler.getUsers )

app.post("/users", userControler.createUser )

app.get("/accounts", async (req: Request, res: Response) => {
    try {
        const accountDatabase = new AccountDatabase()
        const accountsDB: AccountDB[] = await accountDatabase.findAccounts()

        const accounts = accountsDB.map((accountDB) => new Account(
            accountDB.id,
            accountDB.balance,
            accountDB.owner_id,
            accountDB.created_at
        ))

        res.status(200).send(accounts)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/accounts/:id/balance", AccountController.getAcount)

app.post("/accounts", AccountController.postAcountID)

app.put("/accounts/:id/balance", AccountController.editAcount)