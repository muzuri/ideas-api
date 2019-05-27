import { Resolver, Query} from '@nestjs/graphql';
import { UserService } from './user/user.service';

@Resolver('User')
export class UserResolver {
    @Query()
    Users() {
        return [{id: 'id', username: 'username'}];
    }

}
