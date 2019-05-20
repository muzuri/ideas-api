import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { UserDto, userRO } from '../user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>) { }

    async showAll(): Promise<userRO[]> {
        const users = await this.userRepository.find({relations: ['ideas', 'bookmarks']});
        return users.map(user => user.toResponseObject(false));
    }

    async login(data: UserDto): Promise<userRO> {
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user && !user.comparePassword(password)) {
            throw new HttpException(
                'Invalid username or Password',
                HttpStatus.BAD_REQUEST,
            );
        }
        return user.toResponseObject();
    }

    async register(data: UserDto): Promise<userRO> {
        const { username } = data;
        let user = await this.userRepository.findOne({ where: { username } });
        if (user) {
            throw new HttpException('User is already registered', HttpStatus.BAD_REQUEST,
            );
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();

    }
}