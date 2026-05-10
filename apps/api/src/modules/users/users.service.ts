import { UsersRepository } from "./users.repository";
import { NotFoundError, AuthorizationError } from "@/common/errors";
import { PAGINATION } from "@/common/constants";
import { UpdateProfileDTO } from "./users.validation";

export class UsersService {
  static async getProfile(userId: string) {
    const user = await UsersRepository.findById(userId);
    if (!user) throw new NotFoundError("User");
    return user;
  }

  static async listUsers(page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    const safeLimitVal = Math.min(limit, PAGINATION.MAX_LIMIT);
    return UsersRepository.findAll(page, safeLimitVal);
  }

  static async updateProfile(
    requestingUserId: string,
    targetUserId: string,
    requestingRole: string,
    data: UpdateProfileDTO
  ) {
    // Users can only update their own profile; ADMINs can update anyone's
    if (requestingUserId !== targetUserId && requestingRole !== "ADMIN") {
      throw new AuthorizationError("You can only update your own profile");
    }

    const user = await UsersRepository.findById(targetUserId);
    if (!user) throw new NotFoundError("User");

    return UsersRepository.updateProfile(targetUserId, data);
  }

  static async deactivateUser(userId: string) {
    const user = await UsersRepository.findById(userId);
    if (!user) throw new NotFoundError("User");
    return UsersRepository.setActiveStatus(userId, false);
  }

  static async activateUser(userId: string) {
    const user = await UsersRepository.findById(userId);
    if (!user) throw new NotFoundError("User");
    return UsersRepository.setActiveStatus(userId, true);
  }
}
