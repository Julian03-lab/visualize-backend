import { db } from "../config/firebase";

export const deleteObjective = async (userId: string, objectiveId: string) => {
  const objetiveRef = db
    .collection("users")
    .doc(userId)
    .collection("objectives")
    .doc(objectiveId);

  try {
    await db.runTransaction(async (transaction) => {
      const filesSnapshot = await transaction.get(
        objetiveRef.collection("files")
      );

      filesSnapshot.forEach((file) => {
        transaction.delete(file.ref);
      });

      transaction.delete(objetiveRef);
    });
    console.log(`Objetivo ${objectiveId} y sus archivos eliminados con éxito.`);
  } catch (error) {
    console.error("Error al eliminar el objetivo y sus archivos:", error);
  }
};
