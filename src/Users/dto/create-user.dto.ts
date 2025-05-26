import { UserRole } from "../enums/rol.enum";

export class CreateUserDto {
  username_users: string;
  password_users: string;
  rol_users: UserRole;
  is_active_users?: boolean; // Opcional
}
