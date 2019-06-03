import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { UserDto, userRO } from '../user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>) { }

    async showAll(page: number = 1): Promise<userRO[]> {
        const users = await this.userRepository.find({
            relations: ['ideas', 'bookmarks'],
            skip: 3 * (page - 1),
            take: 3,
        });

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
    async read(username: string) {
      const user = await this.userRepository.findOne({where: {username}, relations: ['ideas', ' bookmarks']});
      return user.toResponseObject(false);
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
//  {
//    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhYTE1YzIzLTJkOGItNDM3Ny05N2MzLTUxMDg5NTRkOTE5MSIsInVzZXJuYW1lIjoibXV0YXRpbmEgIiwiaWF0IjoxNTU5MTI0OTcwLCJleHAiOjE1NTk3Mjk3NzB9.DHYYllGLu2Kobp4XFc4K1kvmVIxbx9dqM7CsBrrROUE"
//   }
  // username: mutatina
