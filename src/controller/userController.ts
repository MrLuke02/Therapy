import { Request, response, Response } from 'express';
import { createQueryBuilder, getCustomRepository, getRepository } from 'typeorm';
import { User } from '../models/User';
import { UsersRepository } from '../repositories/UsersRepository';
import { md5 } from 'md5';

class UserController {



    //Criar
    async create(req: Request, res: Response) {
        const md5 = require('md5');

        const { name, cpf, email, password, birthDate, city, state } = req.body;

        if (!name || !cpf || !email || !password || !birthDate || !city || !state) {
            return res.status(400).json({
                Message: "Campo(s) faltando!"
            })
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExist = await usersRepository.findOne({
            email
        })


        if (userAlreadyExist) {
            return res.status(400).json({
                Message: "email already in use"
            })
        }

        const user = usersRepository.create({
            name, cpf, email, password: md5(password), birthDate, city, state
        });

        await usersRepository.save(user);

        return res.json(user);
    }

    //Apagar
    async delete(req: Request, res: Response, params) {

        const { id } = req.params;
        const usersRepository = getCustomRepository(UsersRepository);
        const userExist = await usersRepository.findOne({
            id
        });

        if (!userExist) {
            return res.json({
                Message: "User not found"
            });
        }

        usersRepository.delete({ id });

        return res.status(200).json({
            Message: "sucess"
        });
    }

    //Procurar
    async search(req: Request, res: Response) {
        const md5 = require('md5');

        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                Message: "Campo email não encontrado!"
            })
        } else if (!password) {
            return res.status(400).json({
                Message: "Campo senha não encontrado!"
            })
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const user = await usersRepository.findOne({
            email, password: md5(password)
        });

        if (!user) {
            return res.status(200).json({ Message: "User not found" });
        } else {
            return res.json(user);
        }
    }

    //Atualizar
    async update(req: Request, res: Response) {
        //recebe todos os dados do  usuario a ser editado
        const md5 = require('md5');

        const { id } = req.body;

        if (!id) {
            return res.status(200).json({ Message: "Campo id não encontrado" });
        }

        const usersRepository = getCustomRepository(UsersRepository);

        //porem usa apenas o id para localiza-lo no bd
        let user = await usersRepository.findOne({
            id
        });

        const { name = user.name, cpf = user.cpf, email = user.email, password = user.password, birthDate = user.birthDate, city = user.city, state = user.state } = req.body;

        if (!user) {
            return res.status(400).json("User not found");
        }

        const updatedUser = {
            name: name, cpf: cpf, email: email,
            password: md5(password), birthDate: birthDate
        }


        await usersRepository.update(id, updatedUser)

        return res.json(updatedUser);
    }

    async readFromId(id: any) {

        const usersRepository = getCustomRepository(UsersRepository);

        const user = await usersRepository.findOne({ id });

        return user;
    }


    //Exibir todos
    async show(request: Request, response: Response) {
        const usersRepository = getCustomRepository(UsersRepository);

        const all = await usersRepository.find();
        return response.json(all);
    }

}

export { UserController }