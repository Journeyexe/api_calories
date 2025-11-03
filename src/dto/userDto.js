export class UserDto {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}

export class UserWithTokenDto {
  constructor(user, token) {
    this.user = new UserDto(user);
    this.token = token;
  }
}
