import { db } from "../config/firebase";
import type { IUser } from "../types/types";

export const getAllUsers = async () => {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  if (!snapshot.empty) {
    const users: IUser[] = [];
    snapshot.forEach((doc) => {
      users.push({ ...doc.data(), userId: doc.id } as IUser);
    });

    return users;
  }
};
