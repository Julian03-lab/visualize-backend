import { db } from "../config/firebase";
import { IFile, IObjective } from "../types/types";
import { getAllUsers } from "./usersService";
import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const getAllObjectivesFromUser = async (userId: string) => {
  const objectivesRef = db
    .collection("users")
    .doc(userId)
    .collection("objectives");

  const snapshot = await objectivesRef.get();

  if (snapshot.empty) return null;

  const objectives: IObjective[] = [];

  snapshot.forEach((doc) => {
    if (doc.data().completed) return;

    objectives.push({ ...doc.data(), objectiveId: doc.id } as IObjective);
  });

  return objectives;
};

const getAllFilesFromObjective = async (
  userId: string,
  objectiveId: string
) => {
  const filesRef = db
    .collection("users")
    .doc(userId)
    .collection("objectives")
    .doc(objectiveId)
    .collection("files")
    .orderBy("createdAt", "desc");

  const snapshot = await filesRef.get();

  if (snapshot.empty) return null;

  const files: IFile[] = [];

  snapshot.forEach((doc) => {
    files.push({ ...doc.data(), fileId: doc.id } as IFile);
  });

  return files;
};

const addNewEmptyFile = async (userId: string, objectiveId: string) => {
  const objectiveRef = db
    .collection("users")
    .doc(userId)
    .collection("objectives")
    .doc(objectiveId);

  const filesRef = objectiveRef.collection("files");

  const batch = db.batch();

  const newFileRef = filesRef.doc();

  batch.set(newFileRef, {
    empty: true,
    createdAt: new Date().toISOString(),
  });

  batch.update(objectiveRef, {
    lastPhotoDate: dayjs().format("DD-MM-YYYY"),
  });

  await batch.commit();
};

export const checkLastFile = async () => {
  const allUsers = await getAllUsers();

  for (const user of allUsers) {
    const objectives = await getAllObjectivesFromUser(user.userId);

    if (objectives) {
      //   console.log(`Objetivos del usuario ${user.email}: `, objectives);

      for (const objective of objectives) {
        const files = await getAllFilesFromObjective(
          user.userId,
          objective.objectiveId
        );

        if (files) {
          const lastFile = files[0];

          const lastFileDate = dayjs(lastFile.createdAt);

          const dateToCompare = dayjs().subtract(1, "day");

          if (dateToCompare.isSame(lastFileDate, "day")) {
            // console.log(
            //   `El objetivo ${objective.title} del usuario ${user.email} no ha subido una foto en las últimas 24 horas.`
            // );
            await addNewEmptyFile(user.userId, objective.objectiveId);
          } else {
            // console.log(
            //   `El objetivo ${objective.title} del usuario ${user.email} ha subido una foto en las últimas 24 horas.`
            // );
          }
        } else {
          const dateToCompare = dayjs().subtract(1, "day");
          const startingDate = dayjs(objective.startingDate, "DD/MM/YYYY");

          if (dateToCompare.isSame(startingDate, "day")) {
            // console.log(
            //   `El objetivo ${objective.title} del usuario ${user.email} no ha subido una foto en las últimas 24 horas.`
            // );
            await addNewEmptyFile(user.userId, objective.objectiveId);
          }
        }
      }
    }
  }
};
