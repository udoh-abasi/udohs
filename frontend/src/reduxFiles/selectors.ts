import { User } from "../utils/tsInterface";

interface UserData {
  userLoading: boolean;
  userData: null | Partial<User>;
}

interface TheStore {
  user: UserData;
  isLoading: boolean;
}

export const userSelector = (state: TheStore) => state.user;

export const isLoadingSelector = (state: TheStore) => state.isLoading;
