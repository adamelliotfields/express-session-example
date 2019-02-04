export interface User {
  id: number;
  username: string;
  password: string;
}

export class Users {
  private static u: Users | undefined;

  private readonly users: Array<User>;

  private constructor() {
    this.users = [{ id: 1, username: 'admin', password: 'admin' }];
  }

  public static getInstance() {
    if (Users.u === undefined) {
      Users.u = new Users();
    }

    return Users.u;
  }

  public async findById(id: number): Promise<User | undefined> {
    // noinspection TypeScriptValidateTypes
    return this.users.find(user => user.id === id);
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    // noinspection TypeScriptValidateTypes
    return this.users.find(user => user.username === username);
  }
}
