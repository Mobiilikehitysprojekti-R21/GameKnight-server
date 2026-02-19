import CreateUser from "../application/user/CreateUser";
import ValidateNickname from "../application/user/ValidateNickname";
import ChangeNickname from "../application/user/ChangeNickname"
// import InMemoryUserRepository from "../infrastructure/InMemory/UserRepository";
import postgresUserRepository from "../infrastructure/postgres/UserRepository";
import { pool } from "../infrastructure/postgres/db";
import DeleteUser from "../application/user/DeleteUser";
import AddAvatar from "../application/user/AddAvatar";
import FetchUserNickname from "../application/user/FetchUserNickname";
import GetFavoriteLocations from "../application/user/GetFavoriteLocations";
import AddFavoriteLocation from "../application/user/AddFavoriteLocation";

module.exports = function createUserUseCases() {
  // const userRepo = new InMemoryUserRepository();
  const userRepo = new postgresUserRepository(pool);

  return {
    createUser: new CreateUser(userRepo),
    validateNickname: new ValidateNickname(userRepo),
    updateNickname: new ChangeNickname(userRepo),
    deleteUser: new DeleteUser(userRepo),
    addAvatar: new AddAvatar(userRepo),
    fetchUserNickname: new FetchUserNickname(userRepo),
    getFavoriteLocations: new GetFavoriteLocations(userRepo),
    addFavoriteLocation: new AddFavoriteLocation(userRepo)
  };
};
