import { Account, Avatars, Databases, Client, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aora',
    projectId: '667b4a9c00256e916b6f',
    databaseId: '667b5e5b001ec0f12685',
    userCollectionId: '667b5e770039601dd5e3',
    videoCollectionId: '667b5ead000e68b3b392',
    storageId: '667b6856002efcf00dbf',
}

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases (client)

    export const createUser = async (email, password, username) => {
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username
            )

            if (!newAccount) throw Error;

            const avatarUrl = avatars.getInitials(username)

            await signIn(email, password);

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email: email,
                    username: username,
                    avatar: avatarUrl
                }
            )
            return newUser;

        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    export const signIn = async (email, password) => {
        try {
            const session = await account.createEmailPasswordSession(email, password)

            return session;
        } catch (error) {
            throw new Error(error)
        }
    }

    export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get();
            if (!currentAccount) throw Error

            const currentUser = await databases.listDocuments(
                config.databaseId,
                config.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            )

            if(!currentUser) throw Error;

            return currentUser.documents[0]
        } catch (error) {
            console.log(error)
    }
}