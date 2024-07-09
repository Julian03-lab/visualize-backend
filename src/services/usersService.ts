import { db } from "../config/firebase";

export const getAllUsers = async () => {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  if (!snapshot.empty) {
    const users: any[] = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });

    return users;
  }
};
