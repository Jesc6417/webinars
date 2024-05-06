import { User, UserRepository } from '@/domain/users';
import { MongoUser } from '@/infrastructure/mongo/users/mongo-user';
import { Model } from 'mongoose';

export class MongoUserRepository extends UserRepository {
  constructor(private readonly model: Model<MongoUser.SchemaClass>) {
    super();
  }

  async authenticate(token: string): Promise<boolean> {
    const user = await this.model.findOne({ token });

    return !!user;
  }

  async validate(token: string): Promise<User | undefined> {
    const user = await this.model.findOne({ token });

    if (!user) return undefined;

    return this.toDomain(user);
  }
  async create(user: User): Promise<void> {
    const record = new this.model(this.toPersistence(user));

    await record.save();
  }

  private toDomain(user: MongoUser.Document): User {
    return new User({
      id: user._id,
      email: user.email,
      token: user.token,
    });
  }

  private toPersistence(user: User): MongoUser.SchemaClass {
    return {
      _id: user.props.id,
      email: user.props.email,
      token: user.props.token,
    };
  }
}
