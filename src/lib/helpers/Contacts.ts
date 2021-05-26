import { Client } from "dash/dist/src/SDK/Client/index";

const resolveContacts = async function(client: Client, contacts: any) {
  console.log("contacts :>> ", contacts);
  const { documents } = client!.platform!;

  const profilePromises = contacts.map((dpnsDoc: any) =>
    documents.get("dashpay.profile", {
      where: [["$ownerId", "==", dpnsDoc.$ownerId]],
    })
  );

  return (await Promise.all(profilePromises)).map((x: any) => x[0]?.toJSON());
};

export { resolveContacts };
